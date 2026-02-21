import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Channel } from "@prisma/client";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status") || "all";

    try {
        const clients = await prisma.client.findMany({
            where: { userId: session.user.id }
        });

        if (clients.length === 0) {
            return NextResponse.json([]);
        }

        const clientIds = clients.map(c => c.id);

        let whereClause: any = {
            clientId: { in: clientIds },
            channel: Channel.INSTAGRAM
        };

        if (statusFilter === "pending") {
            whereClause.pipelineState = "descubierto";
        } else if (statusFilter === "answered") {
            whereClause.pipelineState = "contactado";
        } else if (statusFilter === "archived") {
            whereClause.pipelineState = "descartado";
        } else if (statusFilter === "all") {
            whereClause.pipelineState = { not: "descartado" };
        }

        const leads = await prisma.lead.findMany({
            where: whereClause,
            include: {
                conversations: {
                    include: {
                        messages: {
                            orderBy: { timestamp: "asc" }
                        }
                    }
                }
            },
            orderBy: { updatedAt: "desc" }
        });

        const formattedLeads = leads.map(lead => {
            const conversation = lead.conversations[0];
            const messages = conversation?.messages || [];
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

            return {
                id: lead.id,
                username: lead.username || lead.name || "Unknown",
                messages: messages.map(m => ({
                    id: m.id,
                    senderType: m.senderType,
                    textContent: m.textContent,
                    timestamp: m.timestamp
                })),
                lastMessageText: lastMessage?.textContent || "No messages",
                lastMessageTimestamp: lastMessage?.timestamp || lead.createdAt,
                status: lead.pipelineState
            };
        });

        formattedLeads.sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());

        return NextResponse.json(formattedLeads);
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
