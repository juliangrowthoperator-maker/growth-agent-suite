import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Settings, BarChart2, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default async function ClientsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return null; // Or redirect to login
    }

    const clients = await prisma.client.findMany({
        where: { userId: session.user.id as string },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Clientes / Entidades</h1>
                    <p className="text-gray-400 mt-2 font-light">Gestiona las marcas y agencias conectadas a tus agentes.</p>
                </div>
                <Link href="/dashboard/clients/new">
                    <Button>
                        <Plus className="w-5 h-5 mr-2" /> Añadir Cliente
                    </Button>
                </Link>
            </div>

            {clients.length === 0 ? (
                <GlassCard className="text-center py-20 px-6 border-dashed border-white/20">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Plus className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Aún no tienes clientes</h3>
                    <p className="text-gray-400 max-w-sm mx-auto mb-6 font-light">
                        Para empezar a prospectar, primero debes crear el perfil de una marca o agencia para asignarle un agente.
                    </p>
                    <Link href="/dashboard/clients/new">
                        <Button>Crear mi primer cliente</Button>
                    </Link>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <GlassCard key={client.id} className="group hover:border-pine-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{client.name}</h3>
                                    <p className="text-sm text-pine-400 mt-1">{client.niche || "Sin nicho especificado"}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-pine-500/20 flex items-center justify-center text-pine-400 font-bold border border-pine-500/30">
                                    {client.name.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <MessageCircle className="w-4 h-4" />
                                        <span className="text-xs">Canales</span>
                                    </div>
                                    <p className="text-sm font-medium text-white capitalize">{client.channels}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <BarChart2 className="w-4 h-4" />
                                        <span className="text-xs">Leads</span>
                                    </div>
                                    <p className="text-sm font-medium text-white">0 Activos</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <Link href={`/dashboard/clients/${client.id}/knowledge`} className="flex-1">
                                    <Button variant="ghost" className="w-full text-xs">Conocimiento</Button>
                                </Link>
                                <Link href={`/dashboard/clients/${client.id}`} className="flex-1">
                                    <Button variant="secondary" className="w-full text-xs">
                                        <Settings className="w-4 h-4 mr-2" /> Configurar
                                    </Button>
                                </Link>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}
