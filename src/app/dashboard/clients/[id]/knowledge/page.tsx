import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Upload, BrainCircuit, RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default async function KnowledgeBasePage({ params }: { params: { id: string } }) {
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

    const documents = await prisma.knowledgeDocument.findMany({
        where: { clientId: client.id },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/clients" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-400 hover:text-white transition">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Cerebro de la Marca: <span className="text-pine-400">{client.name}</span></h1>
                    <p className="text-gray-400 mt-1 font-light">
                        Alimenta a tu agente con contexto, guiones y reglas de negocio para que sepa cómo responder.
                    </p>
                </div>
                <div className="bg-cinematic-surface border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-pine-400" />
                    <span className="text-sm font-medium text-white">RAG Activo</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content: Upload & Text Input */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard strong>
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-white mb-2">Añadir Nuevo Contexto</h3>
                            <p className="text-sm text-gray-400 mb-6">Pegar texto directo es la forma más rápida de entrenar al Agente para el MVP.</p>

                            <form action={async (formData) => {
                                'use server';
                                const content = formData.get('content') as string;
                                const title = formData.get('title') as string;
                                if (!content || !title) return;

                                await prisma.knowledgeDocument.create({
                                    data: {
                                        clientId: params.id,
                                        fileName: title,
                                        content,
                                        docType: 'TEXT',
                                    }
                                });
                                redirect(`/dashboard/clients/${params.id}/knowledge`);
                            }} className="space-y-4">
                                <div>
                                    <input
                                        name="title"
                                        placeholder="Título del documento (Ej. Guión de Objeciones)"
                                        className="w-full px-4 py-3 bg-cinematic-deep border border-white/10 rounded-xl focus:ring-2 focus:ring-pine-500/50 transition-all text-sm text-white focus:outline-none mb-4"
                                        required
                                    />
                                    <textarea
                                        name="content"
                                        rows={8}
                                        className="w-full px-4 py-3 bg-cinematic-deep border border-white/10 rounded-xl focus:ring-2 focus:ring-pine-500/50 transition-all text-sm text-white focus:outline-none"
                                        placeholder="Escribe o pega aquí la información. Ej: 'Nuestro servicio cuesta $500 y no hacemos descuentos. La llamada dura 30 minutos...'"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit">
                                        Guardar y Entrenar
                                    </Button>
                                </div>
                            </form>
                        </div>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-cinematic-surface px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 border border-white/10 rounded-full">
                                    Subir Archivo (Próximamente)
                                </span>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/5 opacity-50 cursor-not-allowed">
                            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-4" />
                            <h4 className="text-sm font-medium text-gray-300">Arrastra archivos PDF o .DOCX</h4>
                            <p className="text-xs text-gray-500 mt-1">Soporte para extracción de archivos estará disponible pronto.</p>
                        </div>
                    </GlassCard>
                </div>

                {/* Sidebar: Existing Documents list */}
                <div className="space-y-6">
                    <GlassCard className="max-h-[800px] flex flex-col">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                            <h3 className="text-lg font-bold text-white">Memoria Actual</h3>
                            <button title="Refrescar índices" className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                            {documents.length === 0 ? (
                                <div className="text-center py-10">
                                    <BrainCircuit className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                                    <p className="text-sm text-gray-500">Agente sin contexto asignado.</p>
                                </div>
                            ) : (
                                documents.map((doc) => (
                                    <div key={doc.id} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all group">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-cinematic-blue/20 rounded-lg text-cinematic-blue shrink-0">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-white group-hover:text-pine-400 transition-colors line-clamp-1">{doc.fileName}</p>
                                                <p className="text-xs text-gray-500 mt-1 flex justify-between items-center pr-2">
                                                    <span>{doc.docType}</span>
                                                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
