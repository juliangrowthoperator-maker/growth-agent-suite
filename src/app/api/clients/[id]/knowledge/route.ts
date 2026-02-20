import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const clientId = params.id;
        const { fileName, content } = await req.json();

        if (!fileName || !content) {
            return NextResponse.json({ message: "Filename and content are required" }, { status: 400 });
        }

        // Verify ownership
        const client = await prisma.client.findUnique({
            where: { id: clientId, userId: session.user.id }
        });

        if (!client) {
            return NextResponse.json({ message: "Client not found or unauthorized" }, { status: 404 });
        }

        // Create the document
        const document = await prisma.knowledgeDocument.create({
            data: {
                clientId,
                fileName,
                docType: "text",
                content
            }
        });

        return NextResponse.json({ document }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
    }
}

// Optional: DELETE endpoint if we want them to delete documents
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const docId = searchParams.get('docId');

        if (!docId) {
            return NextResponse.json({ message: "Document ID required" }, { status: 400 });
        }

        // Delete document (Prisma Cascade is nice but we can explicitly delete)
        // Wait, let's verify ownership first
        const client = await prisma.client.findUnique({
            where: { id: params.id, userId: session.user.id }
        });

        if (!client) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await prisma.knowledgeDocument.delete({
            where: { id: docId, clientId: params.id }
        });

        return NextResponse.json({ message: "Deleted" }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
    }
}
