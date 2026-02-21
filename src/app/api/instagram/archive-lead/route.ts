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
            include: { client: true }
        });

        if (!lead || lead.client.userId !== session.user.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        await prisma.lead.update({
            where: { id: lead_id },
            data: { pipelineState: "descartado" } // mapping 'archived' state
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error archiving lead:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
