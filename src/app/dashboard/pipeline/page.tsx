import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Search, Filter, Mail, Phone, MoreHorizontal } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default async function PipelinePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        redirect("/login");
    }

    // Get all leads for the user's clients
    const leads = await prisma.lead.findMany({
        where: {
            client: {
                userId: session.user.id as string
            }
        },
        include: {
            client: true
        },
        orderBy: { updatedAt: "desc" }
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-white">Pipeline de Leads</h1>
                    <p className="text-gray-400 mt-1 font-light">Gestiona los prospectos captados por tus agentes.</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            placeholder="Buscar lead..."
                            className="w-full pl-9 pr-4 py-2 bg-cinematic-surface border border-white/10 rounded-xl focus:ring-2 focus:ring-pine-500/50 text-sm text-white placeholder-gray-500 shadow-sm"
                        />
                    </div>
                    <button className="bg-cinematic-surface border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 shadow-sm">
                        <Filter className="w-4 h-4" /> Filtros
                    </button>
                </div>
            </div>

            <GlassCard className="flex-1 p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 font-medium">Lead / Usuario</th>
                                <th className="px-6 py-4 font-medium">Brand</th>
                                <th className="px-6 py-4 font-medium">Score</th>
                                <th className="px-6 py-4 font-medium">Followers</th>
                                <th className="px-6 py-4 font-medium">Estado</th>
                                <th className="px-6 py-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-light">
                                        No hay leads todavía. Conecta una cuenta de Instagram para empezar.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-pine-500/20 border border-pine-500/30 flex items-center justify-center text-pine-400 font-bold shrink-0">
                                                    {lead.username?.charAt(0).toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-200">{lead.name || lead.username || "Usuario Desconocido"}</p>
                                                    <p className="text-xs text-gray-500">@{lead.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{lead.client.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${lead.engagementScore >= 7
                                                    ? 'bg-pine-500/10 text-pine-400 border-pine-500/20'
                                                    : 'bg-white/5 text-gray-400 border-white/10'
                                                }`}>
                                                {lead.engagementScore}/10
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{(lead.followersCount / 1000).toFixed(1)}k</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-cinematic-blue/10 text-cinematic-blue border border-cinematic-blue/20">
                                                {lead.pipelineState.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1.5 text-gray-500 hover:text-pine-400 hover:bg-pine-500/10 rounded-lg transition" title="Ver Conversación">
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-gray-500 hover:text-cinematic-blue hover:bg-cinematic-blue/10 rounded-lg transition" title="Agendar Llamada">
                                                    <Phone className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-gray-500 hover:text-gray-200 hover:bg-white/5 rounded-lg transition">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
