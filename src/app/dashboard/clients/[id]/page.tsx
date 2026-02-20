import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Instagram, MessageSquare, Bot, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default async function ClientConfigPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        redirect("/login");
    }

    const client = await prisma.client.findFirst({
        where: { id: params.id, userId: session.user.id as string },
    });

    if (!client) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/clients" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-400 hover:text-white transition">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Configuración de {client.name}</h1>
                    <p className="text-gray-400 mt-1 font-light">
                        Ajusta los parámetros del agente y conecta los canales.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Config Forms */}
                <div className="md:col-span-2 space-y-6">
                    <GlassCard strong>
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-pine-500/20 flex items-center justify-center text-pine-400 border border-pine-500/30">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Identidad del Agente</h3>
                                <p className="text-sm text-gray-400">Define cómo se comporta la IA para esta marca.</p>
                            </div>
                        </div>

                        <form className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Agente (Bot Persona)</label>
                                <input
                                    type="text"
                                    defaultValue={client.botName || ""}
                                    className="w-full px-4 py-3 bg-cinematic-deep border border-white/10 rounded-xl focus:ring-2 focus:ring-pine-500/50 transition-all text-sm text-white"
                                    placeholder="Ej. Alex de Acme Corp"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Enlace de Calendario (Calendly)</label>
                                <input
                                    type="url"
                                    defaultValue={client.calendarUrl || ""}
                                    className="w-full px-4 py-3 bg-cinematic-deep border border-white/10 rounded-xl focus:ring-2 focus:ring-pine-500/50 transition-all text-sm text-white"
                                    placeholder="https://calendly.com/tu-usuario/30min"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tono de Voz</label>
                                <textarea
                                    defaultValue={client.toneOfVoice || ""}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-cinematic-deep border border-white/10 rounded-xl focus:ring-2 focus:ring-pine-500/50 transition-all text-sm text-white"
                                    placeholder="Breve, directo al grano, usando jerga de desarrollo de software..."
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    Las instrucciones detalladas deben ir en la sección de <Link href={`/dashboard/clients/${client.id}/knowledge`} className="text-pine-400 hover:text-pine-300 underline">Conocimiento</Link>.
                                </p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="button">
                                    <Save className="w-4 h-4 mr-2" /> Guardar Identidad
                                </Button>
                            </div>
                        </form>
                    </GlassCard>
                </div>

                {/* Right Column: Integrations */}
                <div className="space-y-6">
                    <GlassCard strong>
                        <h3 className="text-lg font-bold text-white mb-4">Integraciones</h3>
                        <div className="space-y-4">

                            <div className="p-4 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center text-white shadow-glow">
                                            <Instagram className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white text-sm">Instagram</p>
                                            <p className="text-xs text-gray-400">No conectado</p>
                                        </div>
                                    </div>
                                    <Button variant="secondary" size="sm">Conectar</Button>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-glow">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white text-sm">WhatsApp</p>
                                            <p className="text-xs text-pine-400 font-medium tracking-widest uppercase">Próximamente</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </GlassCard>

                    <GlassCard className="border-red-500/20 bg-red-500/5">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-white">Zona de Peligro</h4>
                                <p className="text-xs text-gray-400 mt-1 mb-4">
                                    Eliminar este cliente borrará todo su historial, leads y configuración. Esta acción no se puede deshacer.
                                </p>
                                <button className="text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition">
                                    Eliminar Cliente
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>

            </div>
        </div>
    );
}
