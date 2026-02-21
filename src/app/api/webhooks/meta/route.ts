import { NextResponse } from "next/server";
import crypto from "crypto";
import { PrismaClient, Channel } from "@prisma/client";

const prisma = new PrismaClient();

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;
const APP_SECRET = process.env.META_APP_SECRET;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return new NextResponse(challenge, {
            status: 200,
            headers: { "Content-Type": "text/plain" },
        });
    }

    return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
    try {
        // 1. Get raw body for signature validation (Required in Next.js App Router)
        const arrayBuffer = await req.arrayBuffer();
        const rawBody = Buffer.from(arrayBuffer);

        // 2. Validate Signature
        const signatureHeader = req.headers.get("x-hub-signature-256");
        if (!signatureHeader || !APP_SECRET) {
            console.warn("Metahook: Missing signature or secret");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const expectedSignature = `sha256=${crypto
            .createHmac("sha256", APP_SECRET)
            .update(rawBody)
            .digest("hex")}`;

        try {
            if (!crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expectedSignature))) {
                console.warn("Metahook: Invalid signature");
                return new NextResponse("Forbidden", { status: 403 });
            }
        } catch (e) {
            console.warn("Metahook: Signature length mismatch");
            return new NextResponse("Forbidden", { status: 403 });
        }

        // 3. Parse JSON
        const body = JSON.parse(rawBody.toString("utf8"));

        // 4. Handle Webhook Payload (Instagram & WhatsApp)
        if (body.object === "instagram" || body.object === "whatsapp_business_account") {
            for (const entry of body.entry) {
                let channel: Channel = Channel.INSTAGRAM;
                let clientId: string | null = null;

                // --------------------------------------------------------
                // WHATSAPP PARSER
                // --------------------------------------------------------
                if (body.object === "whatsapp_business_account" || entry.changes?.[0]?.value?.messaging_product === "whatsapp") {
                    channel = Channel.WHATSAPP;
                    const phoneNumberId = entry.changes?.[0]?.value?.metadata?.phone_number_id;

                    if (phoneNumberId) {
                        const connection = await prisma.whatsAppConnection.findFirst({
                            where: { phoneNumberId }
                        });
                        if (connection) clientId = connection.clientId;
                    }

                    if (clientId && entry.changes) {
                        for (const change of entry.changes) {
                            const value = change.value;

                            // Handling Messages (Text, Images, Audio, Stickers, etc)
                            if (value.messages && value.messages.length > 0) {
                                for (const message of value.messages) {
                                    const waUserId = value.contacts?.[0]?.wa_id || message.from;
                                    const phoneE164 = message.from;
                                    const userName = value.contacts?.[0]?.profile?.name || "";
                                    const externalMessageId = message.id;

                                    let messageType = message.type || "text";
                                    let textContent = "[non-text message]";

                                    if (messageType === "text") textContent = message.text?.body || "";
                                    else if (messageType === "sticker") textContent = "[Sticker]";
                                    else if (messageType === "image") textContent = "[Image]";
                                    else if (messageType === "audio") textContent = "[Audio]";
                                    else if (messageType === "video") textContent = "[Video]";
                                    else if (messageType === "document") textContent = "[Document]";
                                    else if (messageType === "button") textContent = message.button?.text || "[Button]";
                                    else if (messageType === "interactive") textContent = message.interactive?.button_reply?.title || message.interactive?.list_reply?.title || "[Interactive]";

                                    await upsertPipeline(clientId, channel, {
                                        waUserId,
                                        phoneE164,
                                        username: userName,
                                        igUserId: null
                                    }, externalMessageId, textContent, messageType, "received", value);
                                }
                            }

                            // Handling Statuses (Sent, Delivered, Read, Failed)
                            if (value.statuses && value.statuses.length > 0) {
                                for (const statusObj of value.statuses) {
                                    const externalMessageId = statusObj.id;
                                    const statusEnum = statusObj.status;

                                    await prisma.message.updateMany({
                                        where: { externalMessageId, clientId, channel },
                                        data: { status: statusEnum }
                                    });
                                }
                            }
                        }
                    }

                }
                // --------------------------------------------------------
                // INSTAGRAM PARSER
                // --------------------------------------------------------
                else {
                    channel = Channel.INSTAGRAM;
                    const igBusinessAccountId = entry.id; // FB Page ID or IG Business ID

                    if (igBusinessAccountId) {
                        const connection = await prisma.instagramConnection.findFirst({
                            where: { igBusinessAccountId: igBusinessAccountId.toString() }
                        });
                        if (connection) clientId = connection.clientId;
                    }

                    if (clientId && entry.messaging) {
                        for (const event of entry.messaging) {

                            // Handling Messages
                            if (event.message) {
                                const igUserId = event.sender.id;
                                const externalMessageId = event.message.mid;

                                let messageType = "text";
                                let textContent = "[non-text message]";

                                if (event.message.text) {
                                    textContent = event.message.text;
                                } else if (event.message.attachments && event.message.attachments.length > 0) {
                                    const attachmentType = event.message.attachments[0].type;
                                    messageType = attachmentType;
                                    if (attachmentType === "image") textContent = "[Image]";
                                    else if (attachmentType === "video") textContent = "[Video]";
                                    else if (attachmentType === "audio") textContent = "[Audio]";
                                    else if (attachmentType === "file") textContent = "[File]";
                                    else if (attachmentType === "fallback" || attachmentType === "sticker" || attachmentType === "story_mention") {
                                        messageType = "sticker";
                                        textContent = "[Sticker / Story Interaction]";
                                    }
                                } else if (event.message.is_deleted) {
                                    messageType = "system";
                                    textContent = "[Message deleted by user]";
                                }

                                await upsertPipeline(clientId, channel, {
                                    waUserId: null,
                                    phoneE164: null,
                                    username: null,
                                    igUserId: igUserId
                                }, externalMessageId, textContent, messageType, "received", event);
                            }

                            // Handling Deliveries
                            if (event.delivery && event.delivery.mids) {
                                for (const mid of event.delivery.mids) {
                                    await prisma.message.updateMany({
                                        where: { externalMessageId: mid, clientId, channel },
                                        data: { status: "delivered" }
                                    });
                                }
                            }

                            // Handling Read Receipts (IG primarily uses watermarks, but if mids are passed)
                            if (event.read && event.read.mid) {
                                await prisma.message.updateMany({
                                    where: { externalMessageId: event.read.mid, clientId, channel },
                                    data: { status: "read" }
                                });
                            }
                        }
                    }
                }

                if (!clientId) {
                    console.log(`[Meta Webhook] Ignored event for ${channel} (No Client mapping found).`);
                }
            }
        }

        return new NextResponse("EVENT_RECEIVED", { status: 200 });
    } catch (error) {
        console.error("Webhook processing error:", error);
        // Meta requires 200 OK even on failures to prevent HTTP connection drops and endless retries
        return new NextResponse("OK", { status: 200 });
    }
}

// ----------------------------------------------------------------------
// UPSERT MINIMAL PIPELINE
// ----------------------------------------------------------------------
async function upsertPipeline(
    clientId: string,
    channel: Channel,
    leadData: { waUserId: string | null, phoneE164: string | null, username: string | null, igUserId: string | null },
    externalMessageId: string,
    textContent: string,
    messageType: string,
    status: string,
    rawEvent: any
) {

    // 1. Find or Create Lead
    let lead;
    if (channel === Channel.INSTAGRAM && leadData.igUserId) {
        lead = await prisma.lead.findFirst({
            where: { clientId, igUserId: leadData.igUserId }
        });
        if (!lead) {
            lead = await prisma.lead.create({
                data: {
                    clientId,
                    channel,
                    igUserId: leadData.igUserId,
                    username: leadData.username,
                    name: leadData.username
                }
            });
        }
    } else if (channel === Channel.WHATSAPP && leadData.phoneE164) {
        lead = await prisma.lead.findFirst({
            where: { clientId, phoneE164: leadData.phoneE164 }
        });
        if (!lead) {
            lead = await prisma.lead.create({
                data: {
                    clientId,
                    channel,
                    phoneE164: leadData.phoneE164,
                    waUserId: leadData.waUserId,
                    name: leadData.username
                }
            });
        }
    }

    if (!lead) return; // Cannot process without a lead

    // 2. Find or Create Conversation
    let conversation = await prisma.conversation.findFirst({
        where: { clientId, leadId: lead.id, channel }
    });

    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: {
                clientId,
                leadId: lead.id,
                channel,
                lastMessage: textContent,
                lastSenderType: "lead"
            }
        });
    } else {
        conversation = await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
                lastMessage: textContent,
                lastSenderType: "lead",
                updatedAt: new Date()
            }
        });
    }

    // 3. Create Message (avoid duplicates)
    if (externalMessageId) {
        const existingMessage = await prisma.message.findFirst({
            where: { clientId, channel, externalMessageId }
        });

        if (!existingMessage) {
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    leadId: lead.id,
                    clientId,
                    channel,
                    externalMessageId,
                    direction: "in",
                    senderType: "lead",
                    textContent,
                    messageType,
                    status,
                    metadata: JSON.stringify(rawEvent)
                }
            });
        }
    } else {
        // Fallback if no external ID
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                leadId: lead.id,
                clientId,
                channel,
                direction: "in",
                senderType: "lead",
                textContent,
                messageType,
                status,
                metadata: JSON.stringify(rawEvent)
            }
        });
    }
}
