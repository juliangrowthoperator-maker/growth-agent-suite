import prisma from "./prisma";

/**
 * 1. DISCOVERY AGENT
 * Analyzes a new follower or DM sender and calculates engagement score.
 */
export async function runDiscoveryAgent(clientId: string, igUserId: string, username: string, followers: number, following: number) {
    // Logic: In a real scenario, this would use IG Graph API to get media count, likes, comments.
    // We simulate a scoring system based on followers for MVP.

    let score = 0;
    let segment = "micro";

    if (followers < 1000) {
        score = 3;
        segment = "nano";
    } else if (followers < 10000) {
        score = 6;
        segment = "micro";
    } else if (followers < 100000) {
        score = 8;
        segment = "mid";
    } else {
        score = 9.5;
        segment = "macro";
    }

    // Check if lead exists
    let lead = await prisma.lead.findFirst({
        where: { clientId, igUserId }
    });

    if (!lead) {
        lead = await prisma.lead.create({
            data: {
                clientId,
                igUserId,
                username,
                followersCount: followers,
                followingCount: following,
                engagementScore: score,
                segmentSize: segment,
                pipelineState: score >= 6 ? "descubierto" : "descartado" // auto-discard low value
            }
        });
    }

    return lead;
}

/**
 * 2. CHAT AGENT (RAG + Context)
 * Generates a response based on the Brand's tone and Knowledge Base.
 */
export async function runChatAgent(clientId: string, leadId: string, incomingMessage: string) {
    const client = await prisma.client.findUnique({
        where: { id: clientId },
        include: { documents: true }
    });

    if (!client) throw new Error("Client not found");

    // Get conversation history
    const conversation = await prisma.conversation.findFirst({
        where: { clientId, leadId },
        include: { messages: { orderBy: { timestamp: 'asc' }, take: 10 } }
    });

    // Construct Context out of Knowledge Documents (Simple RAG for MVP)
    const contextText = client.documents.map(d => d.content).join("\n\n");

    const systemPrompt = `
Eres ${client.personaName}, actuando en nombre de ${client.name}.
Tu objetivo es calificar al usuario, responder sus dudas y si muestra interés, agendar una llamada.
Tono: ${client.tone}. Trato: ${client.treatment}. Intensidad de venta: ${client.salesIntensity}.

CONOCIMIENTO DE LA MARCA:
${contextText}

REGLAS:
- No uses emojis.
- Sé humano y natural.
- Si detectas interés en servicio, proporciona este link para agendar: ${client.calendarUrl || "https://calendly.com/demo"}
`;

    // In production: Call OpenAI API here
    // const response = await openai.chat.completions.create({ ... })

    // Simulated LLM Response
    const mockResponse = incomingMessage.toLowerCase().includes("precio")
        ? "El costo depende de la escala de tu proyecto. ¿Te parece si agendamos una llamada breve para revisarlo? " + (client.calendarUrl || "")
        : "Interesante. Noté que tienes una comunidad activa en Instagram. ¿Actualmente usas automatizaciones, o todo el alcance es manual?";

    // Save agent message to DB
    if (conversation) {
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                clientId,
                leadId,
                senderType: "agent",
                textContent: mockResponse
            }
        });

        // Update conversation lastMessage
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: { lastMessage: mockResponse, lastSenderType: "agent" }
        });
    }

    return mockResponse;
}
