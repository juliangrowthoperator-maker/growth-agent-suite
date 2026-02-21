import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET || "default_secret_key_needs_32_bytes";
// Ensure key is 32 bytes for aes-256-cbc
const keyBuffer = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);

function encryptToken(text: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { instagramUserId, instagramAccessToken, instagramBusinessAccountId } = body;

        if (!instagramUserId || !instagramAccessToken || !instagramBusinessAccountId) {
            return NextResponse.json({ success: false, status: "error", message: "Todos los campos son obligatorios" }, { status: 400 });
        }

        const url = `https://graph.facebook.com/v19.0/${instagramBusinessAccountId}?access_token=${instagramAccessToken.trim()}`;

        try {
            const fbRes = await fetch(url);
            const fbData = await fbRes.json();

            if (fbData.error) {
                return NextResponse.json({ success: false, status: "error", message: fbData.error.message || "Error validando token con Meta" }, { status: 400 });
            }
        } catch (e) {
            return NextResponse.json({ success: false, status: "error", message: "No se pudo conectar con Graph API" }, { status: 500 });
        }

        // Successfully validated, find the user's client
        const clients = await prisma.client.findMany({
            where: { userId: session.user.id }
        });

        if (clients.length === 0) {
            return NextResponse.json({ success: false, status: "error", message: "No client found for user" }, { status: 404 });
        }

        const client = clients[0];

        // Encrypt the token
        const encryptedToken = encryptToken(instagramAccessToken.trim());

        // Upsert the Instagram connection
        const existingConnection = await prisma.instagramConnection.findFirst({
            where: { clientId: client.id }
        });

        if (existingConnection) {
            await prisma.instagramConnection.update({
                where: { id: existingConnection.id },
                data: {
                    igBusinessAccountId: instagramBusinessAccountId.trim(),
                    accessToken: encryptedToken,
                    status: "connected",
                    updatedAt: new Date()
                }
            });
        } else {
            await prisma.instagramConnection.create({
                data: {
                    clientId: client.id,
                    igBusinessAccountId: instagramBusinessAccountId.trim(),
                    accessToken: encryptedToken,
                    status: "connected"
                }
            });
        }

        return NextResponse.json({ success: true, status: "connected", message: "Instagram conectado exitosamente" });
    } catch (error) {
        console.error("Error connecting instagram:", error);
        return NextResponse.json({ success: false, status: "error", message: "Internal server error" }, { status: 500 });
    }
}
