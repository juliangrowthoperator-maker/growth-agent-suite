import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const clients = await prisma.client.findMany({
            where: { userId: session.user.id },
            include: { igConnections: true }
        });

        if (clients.length === 0) {
            return NextResponse.json({ instagram: { connected: false }, whatsapp: { status: "pending" } });
        }

        const client = clients[0]; // For MVP, assume the main client
        const igConnection = client.igConnections[0];

        return NextResponse.json({
            instagram: {
                connected: !!igConnection,
                user_id: igConnection?.igBusinessAccountId || null,
                status: igConnection?.status || "disconnected"
            },
            whatsapp: { status: "pending" }
        });
    } catch (error) {
        console.error("Error fetching integrations status:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
