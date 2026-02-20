"use client";

import { useSession } from "next-auth/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, Webhook, MessageSquare, PhoneCall, TrendingUp } from "lucide-react";

export default function DashboardOverview() {
    const { data: session } = useSession();

    const stats = [
        { name: 'Nuevos Leads (Esta semana)', value: '142', trend: '+12%', color: 'text-pine-400', icon: Users },
        { name: 'Agentes Activos', value: '3', trend: 'Estable', color: 'text-cinematic-blue', icon: Webhook },
        { name: 'Conversaciones Abiertas', value: '48', trend: '+5', color: 'text-cinematic-accent', icon: MessageSquare },
        { name: 'Llamadas Agendadas', value: '24', trend: '+30%', color: 'text-pine-400', icon: PhoneCall },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Hola, <span className="text-pine-400">{session?.user?.name?.split(' ')[0] || "Operador"}</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-light">
                        Aquí tienes el resumen cinemático de tu red de agentes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <GlassCard key={stat.name} className="relative overflow-hidden group">
                        {/* Subtle interactive glow on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-400">{stat.name}</h3>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-bold text-white tracking-tighter">{stat.value}</p>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${stat.color}`}>
                                {stat.trend}
                            </span>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2">
                    <GlassCard strong className="h-full min-h-[400px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Rendimiento de Conversión</h3>
                            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                <TrendingUp className="w-4 h-4 text-pine-400" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center h-[250px] border border-dashed border-white/10 rounded-2xl bg-white/5">
                            <TrendingUp className="w-10 h-10 text-gray-600 mb-3" />
                            <p className="text-sm text-gray-500">Gráfico de conversión (Próximamente)</p>
                        </div>
                    </GlassCard>
                </div>

                <div>
                    <GlassCard strong className="h-full">
                        <h3 className="text-lg font-semibold text-white mb-6">Actividad Reciente</h3>
                        <div className="space-y-6">
                            {/* Timeline Item 1 */}
                            <div className="flex gap-4">
                                <div className="mt-1 relative">
                                    <div className="w-3 h-3 rounded-full bg-pine-500 shadow-glow"></div>
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white/10"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Llamada agendada</p>
                                    <p className="text-xs text-gray-400">Cliente: Acme Corp • Hace 10 min</p>
                                </div>
                            </div>

                            {/* Timeline Item 2 */}
                            <div className="flex gap-4">
                                <div className="mt-1 relative">
                                    <div className="w-3 h-3 rounded-full bg-cinematic-blue"></div>
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white/10"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Nuevo mensaje de IA enviado</p>
                                    <p className="text-xs text-gray-400">Cliente: Startups.io • Hace 25 min</p>
                                </div>
                            </div>

                            {/* Timeline Item 3 */}
                            <div className="flex gap-4">
                                <div className="mt-1 relative">
                                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Base de conocimiento actualizada</p>
                                    <p className="text-xs text-gray-400">Hace 2 horas</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
