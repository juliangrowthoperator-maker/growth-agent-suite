import { NextResponse } from "next/server";
import { runDiscoveryAgent, runChatAgent } from "@/lib/agents";
import prisma from "@/lib/prisma";

// GET for Instagram Webhook Verification
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    // MY_VERIFY_TOKEN is configured in Meta App
    if (mode === "subscribe" && token === "growth_agent_secret_token") {
        return new NextResponse(challenge, { status: 200 });
    }

    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
}

// POST for incoming Instagram Messages/Follows
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Check if it's an Instagram Webhook event
        if (body.object === "instagram") {
            for (const entry of body.entry) {
                // IG Account ID
                const igAccountId = entry.id;

                // MVP: find which Client owns this igAccountId (Placeholder logic)
                // const connection = await prisma.instagramConnection.findFirst({ where: { igBusinessAccountId: igAccountId } });
                // const clientId = connection.clientId;
                const clientId = "mock-client-id-for-testing";

                for (const messaging of entry.messaging) {
                    const senderId = messaging.sender.id; // User sending DM

                    // If text message received
                    if (messaging.message && messaging.message.text) {

                        // 1. Run Discovery Agent implicitly if Lead doesn't exist
                        // (We mock followers count for this example API)
                        const lead = await runDiscoveryAgent(clientId, senderId, "usuario_" + senderId, 5000, 200);

                        // 2. Run Chat agent
                        await runChatAgent(clientId, lead.id, messaging.message.text);

                        // 3. Send message back via Instagram Graph API
                        // await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/messages...`)

                    }
                }
            }
            return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
        }

        return NextResponse.json({ status: "UNKNOWN_EVENT" }, { status: 404 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
