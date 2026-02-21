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
        const { lead_id } = body;

        if (!lead_id) {
            return NextResponse.json({ error: "Missing lead_id" }, { status: 400 });
        }

        const lead = await prisma.lead.findUnique({
            where: { id: lead_id },
            include: {
                client: {
                    include: { igConnections: true }
                },
                conversations: {
                    include: {
                        messages: {
                            orderBy: { timestamp: 'desc' },
                            take: 5
                        }
                    }
                }
            }
        });

        if (!lead || lead.client.userId !== session.user.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        const conversation = lead.conversations[0];
        if (!conversation) {
            return NextResponse.json({ error: "No active conversation found" }, { status: 400 });
        }

        const recentMessages = conversation.messages.reverse();
        const messageHistoryText = recentMessages.map(m => `${m.senderType === 'lead' ? 'Usuario' : 'Agente'}: ${m.textContent}`).join('\n');

        let generatedResponse = "Hola, en este momento nuestros agentes están ocupados, ¿en qué te puedo ayudar?";

        const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
        if (ANTHROPIC_API_KEY) {
            try {
                const prompt = `Eres un asistente virtual (Growth Agent) para la marca ${lead.client.name}.
Tu tono es ${lead.client.tone || "amigable"}.
Aquí está la conversión reciente con el usuario:
${messageHistoryText}

Genera una respuesta corta, empática y directa (1-2 oraciones) siguiendo tu tono, en español.
No uses emojis ni intros, responde directamente con el mensaje.`;

                const anthropicReq = await fetch("https://api.anthropic.com/v1/messages", {
                    method: "POST",
                    headers: {
                        "x-api-key": ANTHROPIC_API_KEY,
                        "anthropic-version": "2023-06-01",
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "claude-3-haiku-20240307",
                        max_tokens: 150,
                        messages: [
                            { role: "user", content: prompt }
                        ]
                    })
                });

                if (anthropicReq.ok) {
                    const anthropicRes = await anthropicReq.json();
                    if (anthropicRes.content && anthropicRes.content[0]?.text) {
                        generatedResponse = anthropicRes.content[0].text.trim();
                    }
                } else {
                    console.error("Anthropic API Error:", await anthropicReq.text());
                }
            } catch (e) {
                console.error("Anthropic Error:", e);
            }
        }

        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                leadId: lead.id,
                clientId: lead.clientId,
                channel: "INSTAGRAM",
                direction: "out",
                senderType: "agent",
                textContent: generatedResponse,
                status: "sent",
                messageType: "text"
            }
        });

        await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
                lastMessage: generatedResponse,
                lastSenderType: "agent",
                updatedAt: new Date()
            }
        });

        await prisma.lead.update({
            where: { id: lead.id },
            data: { pipelineState: "contactado" }
        });

        const igConnection = lead.client.igConnections[0];
        if (igConnection && igConnection.accessToken && lead.igUserId) {
            const url = `https://graph.facebook.com/v19.0/${igConnection.igBusinessAccountId}/messages`;
            try {
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${igConnection.accessToken.trim()}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        recipient: { id: lead.igUserId },
                        message: { text: generatedResponse }
                    })
                });
            } catch (e) {
                console.error("Failed to send AI msg to Meta API", e);
            }
        }

        return NextResponse.json({ success: true, message_sent: true, generated_response: generatedResponse });
    } catch (error) {
        console.error("Error activating agent:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
