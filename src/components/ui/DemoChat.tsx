"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, Loader2 } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function DemoChat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hey, soy Ani. Un gusto. ¿Cómo te llamas?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const quickPrompts = [
        "Soy agencia, más por IG",
        "Soy creator, WhatsApp",
        "¿Cuánto cuesta The Forge?",
        "¿Me das un ejemplo real?",
        "Quiero aplicar"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const newMessages = [...messages, { role: "user" as const, content: text }];
        setMessages(newMessages);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch("/api/forge-demo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!res.ok) {
                if (res.status === 429) {
                    setMessages(prev => [...prev, { role: "assistant", content: "Llegaste al límite de mensajes de prueba. Si te hace sentido lo que armamos, aplica a The Forge y lo montamos con tu info." }]);
                } else {
                    setMessages(prev => [...prev, { role: "assistant", content: "Uy, hubo un error de conexión. ¿Puedes intentar de nuevo?" }]);
                }
                setIsTyping(false);
                return;
            }

            const data = await res.json();
            setMessages(prev => [...prev, data]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "assistant", content: "Error procesando el mensaje." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-cinematic-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(6,95,70,0.3)]">

            {/* Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-pine-600 flex items-center justify-center text-white shadow-glow">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="absolute top-0 right-0 w-3 h-3 bg-pine-400 rounded-full border-2 border-cinematic-surface"></div>
                    </div>
                    <div>
                        <div>
                            <h3 className="font-bold text-white text-sm">Ani</h3>
                            <p className="text-xs text-pine-400 font-medium tracking-wide">The Forge</p>
                        </div>          </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans no-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${msg.role === "user"
                            ? "bg-pine-600 text-white rounded-br-sm shadow-lg"
                            : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm"
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-pine-400 animate-spin" />
                            <span className="text-xs text-gray-400 font-medium">Pensando...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                {quickPrompts.map((prompt, i) => (
                    <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-black/20 border-t border-white/5">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                    className="relative flex items-center"
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isTyping}
                        placeholder="Responde a Ani..."
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pine-500/50 transition-all placeholder:text-gray-600 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-1.5 p-2 bg-pine-600 hover:bg-pine-500 rounded-full text-white transition-colors disabled:opacity-50 disabled:bg-gray-700"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>

        </div>
    );
}
