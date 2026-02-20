import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { name, niche, language, channels, personaName, tone } = await req.json();

        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }

        const client = await prisma.client.create({
            data: {
                userId: session.user.id,
                name,
                niche: niche || null,
                language: language || "es",
                channels: channels || "instagram",
                personaName: personaName || "Equipo",
                tone: tone || "amigable",
            }
        });

        return NextResponse.json({ client }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
    }
}
