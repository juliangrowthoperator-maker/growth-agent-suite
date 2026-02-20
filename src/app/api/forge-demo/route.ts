import { NextResponse } from "next/server";

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const LIMIT = 5;
const WINDOW_MS = 60000;

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown-ip";

        const now = Date.now();
        const userLimit = rateLimit.get(ip);

        if (userLimit) {
            if (now - userLimit.timestamp < WINDOW_MS) {
                if (userLimit.count >= LIMIT) {
                    return NextResponse.json(
                        { error: "Rate limit exceeded" },
                        { status: 429 }
                    );
                }
                userLimit.count++;
            } else {
                rateLimit.set(ip, { count: 1, timestamp: now });
            }
        } else {
            rateLimit.set(ip, { count: 1, timestamp: now });
        }

        const body = await req.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
        }

        const lastMessage = messages[messages.length - 1].content.toLowerCase();

        const allText = messages.map((m: any) => m.content.toLowerCase()).join(" ");
        const assistantMessages = messages.filter((m: any) => m.role === "assistant");
        const userMessages = messages.filter((m: any) => m.role === "user");
        const userText = userMessages.map((m: any) => m.content.toLowerCase()).join(" ");

        // Memory Extraction (Strict)
        const hasAgency = userText.includes("agencia") || userText.includes("servicios") || userText.includes("b2b");
        const hasCreator = userText.includes("creator") || userText.includes("infoprodu") || userText.includes("marca");

        // Strict ticket detection (no catch-all regex)
        const hasTicketOrVol = userText.includes("$") ||
            userText.includes("€") ||
            userText.includes("ticket") ||
            userText.includes("dms") ||
            userText.includes("dm") ||
            userText.includes("mensajes") ||
            userText.includes("al día") ||
            userText.includes("por día") ||
            userText.includes("diario") ||
            /^\d{2,}\s*[€\$]?/.test(userText);

        // Strict Call detection
        const includesCalls = userText.includes("dos") || userText.includes("tres") || userText.includes("cuatro") || userText.includes("cinco") || /^\s*(\d+)\s*(llamadas?)?\s*$/.test(lastMessage);
        const lastAssistantQuestion = assistantMessages.length > 0 ? assistantMessages[assistantMessages.length - 1].content : "";

        // Extracción de Nombre Segura
        let userName = "";
        const nameQuestionIdx = assistantMessages.findIndex((m: any) => m.content.toLowerCase().includes("cómo te llamas") || m.content.toLowerCase().includes("con quién hablo"));
        const refusedName = userText.includes("prefiero no") || userText.includes("no te lo digo") || userText.includes("no quiero") || userText.includes("anónimo") || userText.includes("anonimo");

        if (nameQuestionIdx !== -1 && userMessages.length > nameQuestionIdx && !refusedName) {
            const userMsgAfterNameQ = userMessages[nameQuestionIdx]?.content || "";
            const rawWords = userMsgAfterNameQ.replace(/[.,!¡¿?]/g, '').trim().split(/\s+/);
            if (rawWords.length === 1) {
                const potentialName = rawWords[0];
                if (potentialName && potentialName.length >= 2 && potentialName.length <= 15 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(potentialName) && !["no", "soy", "me", "llamo", "hola", "hey", "holaa", "buenas", "hello", "que"].includes(potentialName.toLowerCase())) {
                    userName = potentialName.charAt(0).toUpperCase() + potentialName.slice(1).toLowerCase();
                }
            }
        }
        const nameCallout = userName && !refusedName ? `, ${userName}` : "";

        // Empathy Tracking
        const needsEmpathy = lastMessage.includes("caos") || lastMessage.includes("abasto") || lastMessage.includes("escapan") || lastMessage.includes("quema") || lastMessage.includes("bots") || lastMessage.includes("escalar") || lastMessage.includes("miedo") || lastMessage.includes("duda") || lastMessage.includes("difícil");

        // Process Flags
        const hasOfferedSim = assistantMessages.some((m: any) => m.content.toLowerCase().includes("simule") || m.content.toLowerCase().includes("simular") || m.content.toLowerCase().includes("simulación"));
        const hasGivenSim = assistantMessages.some((m: any) => m.content.includes("(Ani)"));
        const hasOfferedCalendly = assistantMessages.some((m: any) => m.content.includes("dos opciones"));
        const stepCount = userMessages.length; // Number of turns

        let responseText = "";
        let empathyPrefix = "";

        if (needsEmpathy) {
            if (lastMessage.includes("bot") || lastMessage.includes("duda")) empathyPrefix = "Normal que dudes: si suena a bot, la gente se enfría. ";
            else if (lastMessage.includes("escapan") || lastMessage.includes("tardar")) empathyPrefix = "Uf, sí… perder leads por tardar en responder frustra. ";
            else if (lastMessage.includes("miedo") || lastMessage.includes("quema")) empathyPrefix = "Tiene sentido; quemar audiencia por insistir mal da miedo. ";
            else empathyPrefix = "Te entiendo… cuando el volumen sube, se desordena todo rápido. ";
        }

        const isGreeting = ["hola", "hey", "holaa", "buenas", "hello", "que tal", "qué tal", "saludos"].includes(lastMessage.trim().replace(/[.,!¡¿?]/g, '').toLowerCase());
        const isStrictB = lastMessage.includes("oferta") ||
            lastMessage.includes("ayudo a") ||
            lastMessage.includes("ofrezco") ||
            lastMessage.includes("vendo") ||
            lastMessage.includes("prometo") ||
            (lastMessage.includes("en ") && lastMessage.includes("días")) ||
            lastMessage.includes("lanzamiento") ||
            lastMessage.includes("programa") ||
            lastMessage.includes("mentoría");

        // 0. EXACT OVERRIDE (Greetings priority over everything)
        if (isGreeting && !userName && !refusedName && stepCount <= 2) {
            if (lastAssistantQuestion.toLowerCase().includes("cómo te llamas")) {
                responseText = "Jeje hola de nuevo. Pero en serio, ¿con quién hablo?";
            } else {
                responseText = "Hey, soy Ani. Un gusto. ¿Cómo te llamas?";
            }
        }

        // 0.2 CALENDLY FULFILLMENT OVERRIDE
        else if (hasOfferedCalendly) {
            if (lastMessage.includes("link") || lastMessage.includes("pasa") || lastMessage.includes("pásame") || lastMessage.includes("calendario") || lastMessage.includes("1") || lastMessage.includes("opción 1")) {
                responseText = `Aquí lo tienes${nameCallout}: https://calendly.com/juliangrowthoperator/30min\nCuando reserves, te llega invitación por Google Calendar.\n\n— Ani`;
            } else if (/\d/.test(lastMessage) && (lastMessage.includes("h") || lastMessage.includes("pm") || lastMessage.includes("am") || lastMessage.includes("hora") || lastMessage.includes("mañana") || lastMessage.includes("tarde") || lastMessage.includes("2") || lastMessage.includes("opción 2"))) {
                responseText = "Perfecto. ¿En qué zona horaria estás?\n\n— Ani";
            } else {
                responseText = "Si te cuadra, lo vemos 30 min y te lo dejo aterrizado. ¿Prefieres que te pase el link o me dices dos huecos y lo encajamos?";
            }
        }

        // 0.5 CALENDLY CLOSING TRIGGER OVERRIDE (If they say YES to booking after simulation)
        else if (hasGivenSim && (lastMessage.trim().toLowerCase() === "a" || lastMessage.includes("aplicar") || lastMessage.includes("aplico") || lastMessage.includes("vale") || lastMessage.includes("quiero") || lastMessage.includes("cómo seguimos") || lastMessage.includes("agendamos") || lastMessage.includes("reunión") || lastMessage.includes("llamada") || lastMessage.includes("montar") || lastMessage.includes("montamos"))) {
            responseText = "Para no alargar esto por DM, lo mejor es verlo 30 min y te digo exactamente cómo lo montaría en tu caso.\n\nSi te viene bien, dos opciones:\nTe paso mi link y eliges un hueco.\nMe dices 2 horarios y te confirmo cuál encaja.\n\n¿Qué prefieres?";
        }

        // 1. EXACT OVERRIDES (Price)
        else if (lastMessage.includes("precio") || lastMessage.includes("cuesta") || lastMessage.includes("costo") || lastMessage.includes("cuánto") || lastMessage.includes("valor")) {
            if (!hasTicketOrVol) {
                responseText = "Depende un poco del caso. Para decirte algo real, ¿tu ticket promedio es de cuánto o cuántos DMs te entran al día?";
            } else {
                responseText = "Con el volumen y ticket que manejas, normalmente se ajusta por escala y complejidad. ¿Tu prioridad ahora mismo es automatizar para liberar tiempo o mejorar la conversión?";
            }
        }

        // 2. EXACT OVERRIDES (Simulation Execution - Strict yes)
        else if (hasOfferedSim && !hasGivenSim) {
            const isStrictYes = ["si", "sí", "dale", "simula", "ok simula", "va", "perfecto", "sí por favor", "si porfa", "vale", "bueno", "ok", "claro", "por qué no"].some(word => lastMessage.trim().replace(/[.,!¡¿?]/g, '') === word);
            const isIncludesYes = lastMessage.includes("simula") || lastMessage.includes("ejemplo");

            if (isStrictYes || isIncludesYes) {
                let simLead = "precio?";
                let simResp = "Hola, depende de qué estemos hablando. ¿Tu ticket promedio es de cuánto o cuántos DMs te entran al día?";

                if (hasAgency && hasTicketOrVol) {
                    simLead = "busco info del servicio de ads";
                    simResp = "Hola. Para afinar un poco, ¿estás invirtiendo en captación ahora mismo o es orgánico?";
                }

                responseText = `(Ani): 'Hola, para saber si te podemos ayudar, ¿estás invirtiendo en ads actualmente?'\n(Lead): '${simLead}'\n(Ani): '${simResp}'\n\nSi te encaja, te dejo dos caminos:\n(a) aplicas y lo montamos contigo, o\n(b) me dices tu oferta en 1 línea y te armo el primer flujo aquí mismo.`;
            } else {
                // Reformulate distinct option if looped on strict yes:
                responseText = "¿Ahorita tu mayor problema es responder tarde o que llegan llamadas muy poco calificadas?";
            }
        }

        // 3. EXACT OVERRIDES (Two-Path CTA Resolution - Explicit B detection)
        else if (hasGivenSim && (lastMessage.trim().toLowerCase().startsWith("b:") || lastMessage.trim().toLowerCase().startsWith("b ") || lastMessage.trim().toLowerCase() === "b" || isStrictB)) {
            responseText = empathyPrefix + "Me queda claro. Para tu oferta, yo haría esto por DM:\n\nMensaje 1: gancho corto + 1 pregunta (situación).\nMensaje 2: 2 preguntas de fit (ticket + timing).\nSi encaja: llamada. Si no: recurso/seguimiento suave.\n\n¿Tú cierras por llamada o por checkout?";
        }

        // 4. MAIN SEQUENTIAL FLOW (If no overrides triggered)
        if (!responseText) {

            // Turn 1 Response (After Name or implicit start)
            if (assistantMessages.some((m: any) => m.content.toLowerCase().includes("cómo te llamas") || m.content.toLowerCase().includes("con quién hablo")) && stepCount <= 3 && (!hasAgency && !hasCreator)) {
                if (userName && !refusedName) {
                    responseText = empathyPrefix + `Genial, ${userName}. ¿Eres creator/infoproductor o agencia?`;
                } else {
                    responseText = empathyPrefix + `Cero problema. ¿Eres creator/infoproductor o agencia?`;
                }
            }
            // Normal Fallback Sequence
            else if (!hasAgency && !hasCreator) {
                if (lastAssistantQuestion.includes("creator/infoproductor o agencia") && !isGreeting) {
                    // Loop prevention logic
                    responseText = (empathyPrefix ? empathyPrefix : "Sin problema. Para afinarlo un poco: ") + "¿tu ticket medio es de cuánto o cuántos DMs te entran al día, a ojo?";
                } else {
                    responseText = (empathyPrefix ? empathyPrefix : "¡Genial! ") + "Para no darte respuestas genéricas, cuéntame: ¿tu proyecto actual es más de agencia o eres creator/infoproductor?";
                }
            }
            else if (!hasTicketOrVol) {
                responseText = (empathyPrefix ? empathyPrefix : "Vale, te pillo. ") + "¿Me dices tu ticket medio, más o menos, o cuántos DMs te entran al día?";
            }
            else if (!assistantMessages.some((m: any) => m.content.includes("llamada o por checkout"))) {
                responseText = (empathyPrefix ? empathyPrefix : "Genial, así me cuadra. ") + "¿Ahora mismo cierras por llamada o por checkout?";
            }
            else if (!assistantMessages.some((m: any) => m.content.includes("frenando más"))) {
                responseText = (empathyPrefix ? empathyPrefix : "Te hago una pregunta y con eso lo aterrizo: ") + "¿qué te está frenando más: responder tarde o filtrar curiosos?";
            }
            // Turn Offer Simulation
            else if (!hasOfferedSim) {
                responseText = (empathyPrefix ? empathyPrefix : "Perfecto, entonces vamos al grano. ") + "Nosotros usamos un flujo inicial súper humano para arreglar eso. ¿Te importa si simulo 2 mensajes reales (lead + respuesta) para que veas cómo queda?";
            }
            // Failsafe & Loop prevention
            else {
                if (lastAssistantQuestion.includes("fuerte es Instagram o WhatsApp")) {
                    responseText = "Para no alargar esto por DM, lo mejor es verlo 30 min y te digo exactamente cómo lo montaría en tu caso.\n\nSi te viene bien, dos opciones:\nTe paso mi link y eliges un hueco.\nMe dices 2 horarios y te confirmo cuál encaja.\n\n¿Qué prefieres?";
                } else {
                    responseText = (empathyPrefix ? empathyPrefix : "") + "Cuando puedas, ¿me confirmas si tu canal fuerte es Instagram o WhatsApp?";
                }
            }
        }

        await new Promise((resolve) => setTimeout(resolve, 800));

        return NextResponse.json({
            role: "assistant",
            content: responseText
        });

    } catch (error) {
        console.error("Demo Agent Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
