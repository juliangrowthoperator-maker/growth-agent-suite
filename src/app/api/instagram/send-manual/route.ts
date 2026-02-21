import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { lead_id, message_text } = body;

        if (!lead_id || !message_text) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const lead = await prisma.lead.findUnique({
            where: { id: lead_id },
            include: {
                client: {
                    include: { igConnections: true }
                },
                conversations: true
            }
        });

        if (!lead || lead.client.userId !== session.user.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        const conversation = lead.conversations[0];
        if (!conversation) {
            return NextResponse.json({ error: "No active conversation found" }, { status: 400 });
        }

        // Create the message in DB
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                leadId: lead.id,
                clientId: lead.clientId,
                channel: "INSTAGRAM",
                direction: "out",
                senderType: "human",
                textContent: message_text,
                status: "sent",
                messageType: "text"
            }
        });

        // Update conversation last message
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
                lastMessage: message_text,
                lastSenderType: "human",
                updatedAt: new Date()
            }
        });

        // Update lead state
        await prisma.lead.update({
            where: { id: lead.id },
            data: { pipelineState: "contactado" }
        });

        // Send to Meta API
        const igConnection = lead.client.igConnections[0];
        if (igConnection && igConnection.accessToken && lead.igUserId) {
            const url = `https://graph.facebook.com/v19.0/${igConnection.igBusinessAccountId}/messages`;
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${igConnection.accessToken.trim()}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        recipient: { id: lead.igUserId },
                        message: { text: message_text }
                    })
                });

                if (!res.ok) {
                    console.error("Meta API Error:", await res.text());
                }
            } catch (e) {
                console.error("Failed to send to Meta API", e);
            }
        } else {
            console.warn("No active IG connection or igUserId. Just saved to DB.");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error sending manual message:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
