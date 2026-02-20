import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Search, Send, Bot, CheckCircle2 } from "lucide-react";

export default async function InboxPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        redirect("/login");
    }

    // Placeholder for Conversations (MVP UI Demonstration)
    const conversations = [
        { id: "1", name: "Carlos Pérez", username: "carlosp", platform: "instagram", lastMessage: "¿Cómo funciona el servicio?", time: "10:04 AM", unread: 2, isActive: true },
        { id: "2", name: "María Gómez", username: "maryg", platform: "whatsapp", lastMessage: "Agendado para el jueves a las 3", time: "Ayer", unread: 0, isActive: false },
        { id: "3", name: "Startup Tech", username: "startuptech", platform: "instagram", lastMessage: "Interesante, reviso y te aviso", time: "Lun", unread: 0, isActive: false },
    ];

    return (
        <div className="h-[calc(100vh-8rem)] flex rounded-2xl overflow-hidden border border-white/10 shadow-glass bg-cinematic-surface/50 backdrop-blur-md">

            {/* Left Sidebar: Conversations List */}
            <div className="w-80 border-r border-white/5 flex flex-col bg-black/20">
                <div className="p-4 border-b border-white/5">
                    <h2 className="font-semibold text-white mb-4">Inbox</h2>
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            placeholder="Buscar conversación..."
                            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-pine-500/50 text-sm text-white placeholder-gray-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map((conv) => (
                        <button key={conv.id} className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${conv.isActive ? 'bg-pine-500/10 border-l-2 border-l-pine-500' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                                <p className={`font-semibold text-sm truncate pr-2 ${conv.isActive ? 'text-pine-400' : 'text-gray-200'}`}>{conv.name}</p>
                                <span className="text-xs text-gray-500 shrink-0">{conv.time}</span>
                            </div>
                            <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                                    {conv.platform}
                                </span>
                                {conv.unread > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-pine-500 text-white text-xs flex items-center justify-center font-bold shadow-glow">
                                        {conv.unread}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Center: Chat Window */}
            <div className="flex-1 flex flex-col bg-transparent border-r border-white/5 relative">
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-sm z-10 w-full">
                    <div>
                        <h3 className="font-semibold text-white">Carlos Pérez</h3>
                        <p className="text-xs text-pine-400 font-medium flex items-center gap-1">
                            <Bot className="w-3 h-3" /> Agente AI respondiendo automáticamente
                        </p>
                    </div>

                    <button className="text-sm font-medium bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg transition border border-white/10">
                        Pausar AI e Intervenir
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Chat Bubble Lead */}
                    <div className="flex items-end gap-2 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-pine-500/20 border border-pine-500/30 flex items-center justify-center text-pine-400 shrink-0 mt-auto">
                            C
                        </div>
                        <div className="bg-white/5 text-gray-200 rounded-2xl rounded-bl-sm p-4 text-sm border border-white/10">
                            He visto su perfil en Instagram. ¿Cómo funciona exactamente el servicio para agencias?
                        </div>
                    </div>

                    {/* Chat Bubble Agent */}
                    <div className="flex items-end justify-end gap-2 max-w-[80%] ml-auto">
                        <div className="bg-cinematic-primary text-white rounded-2xl rounded-br-sm p-4 text-sm shadow-glass-sm border border-pine-500/50">
                            ¡Hola Carlos! El servicio funciona instalando agentes en tus cuentas de Instagram y WhatsApp. Ellos se encargan de prospectar, calificar por engagement y agendar llamadas siguiendo tus guiones exactos. ¿Recibes muchos DMs diarios actualmente?
                        </div>
                        <div className="w-8 h-8 rounded-full bg-pine-900 border border-pine-500/50 flex items-center justify-center text-pine-400 shrink-0 mt-auto shadow-glow">
                            <Bot className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-black/20 border-t border-white/5 flex gap-2 backdrop-blur-md">
                    <input
                        placeholder="Intervenir en la conversación (pausará la AI)..."
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-pine-500/50 transition-all text-sm text-white placeholder-gray-500"
                    />
                    <button className="bg-cinematic-primary hover:bg-pine-700 text-white p-3 rounded-xl transition shadow-glow flex items-center justify-center border border-pine-500/50">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Right Sidebar: Lead Info */}
            <div className="w-72 bg-black/20 hidden lg:flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <div className="w-20 h-20 bg-pine-500/10 rounded-full mx-auto flex items-center justify-center text-pine-400 text-2xl font-bold mb-4 border border-pine-500/30 shadow-glow">
                        C
                    </div>
                    <h3 className="text-center font-bold text-white text-lg">Carlos Pérez</h3>
                    <p className="text-center text-gray-500 text-sm">@carlosp</p>
                </div>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Pipeline</h4>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 py-2 px-3 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-pine-400" />
                            <span className="text-sm font-medium text-gray-300">Interesado</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Información (Instagram)</h4>
                        <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 text-xs">Followers</span>
                                <span className="font-semibold text-gray-200">12.4k</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 text-xs">Engagement</span>
                                <span className="font-semibold text-pine-400 bg-pine-500/10 border border-pine-500/20 px-2 py-0.5 rounded-md">8.5/10</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 text-xs">Segmento</span>
                                <span className="font-medium text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-xs">Mid Creator</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Notas del Agente</h4>
                        <p className="text-sm text-gray-400 leading-relaxed bg-cinematic-surface border border-white/5 rounded-xl p-4">
                            El prospecto busca automatizar la prospección de su agencia. Tiene buena audiencia pero falta sistema de cierre.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
