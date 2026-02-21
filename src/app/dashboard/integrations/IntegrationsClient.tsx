"use client";

import { useEffect, useState } from "react";
import { Instagram, MessageSquare, CheckCircle2, AlertCircle, Link as LinkIcon, Lock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

interface IntegrationStatus {
    connected: boolean;
    user_id?: string | null;
    status: "connected" | "error" | "disconnected";
}

export default function IntegrationsClient() {
    const [status, setStatus] = useState<{ instagram: IntegrationStatus, whatsapp: { status: string } } | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [form, setForm] = useState({
        instagramUserId: "",
        instagramAccessToken: "",
        instagramBusinessAccountId: ""
    });

    const fetchStatus = async () => {
        try {
            const res = await fetch("/api/integrations/status");
            if (res.ok) {
                const data = await res.json();
                setStatus(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleConnectInstagram = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!form.instagramUserId || !form.instagramAccessToken || !form.instagramBusinessAccountId) {
            setErrorMsg("Todos los campos son obligatorios.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/integrations/connect-instagram", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (data.success) {
                setSuccessMsg(data.message);
                setForm({ instagramUserId: "", instagramAccessToken: "", instagramBusinessAccountId: "" });
                await fetchStatus();
            } else {
                setErrorMsg(data.message || "Error al conectar Instagram.");
            }
        } catch (error) {
            setErrorMsg("Error de conexión con el servidor.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-gray-400">Cargando integraciones...</div>;
    }

    const isIgConnected = status?.instagram?.connected && status?.instagram?.status === "connected";

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Integraciones</h1>
                <p className="text-gray-400 mt-1 font-light">
                    Conecta tus canales de comunicación manualmente para habilitar a los Agentes de IA. Los tokens son encriptados de manera segura en base de datos ("Bank-grade Security").
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* INSTAGRAM CARD */}
                <GlassCard strong className={isIgConnected ? "border-pine-500/30" : ""}>
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5 relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center text-white shadow-glow">
                            <Instagram className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                Instagram Business
                                {isIgConnected && <CheckCircle2 className="w-4 h-4 text-pine-400" />}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {isIgConnected ? "Conectado y validado" : "Pendiente de configuración"}
                            </p>
                        </div>
                    </div>

                    {isIgConnected ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-pine-500/10 border border-pine-500/20 rounded-xl flex gap-3 text-pine-400">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold mb-1">Conexión Exitosa</p>
                                    <p className="text-pine-300">Cuenta de Meta validada. Los webhooks están listos para reaccionar a los DMs del Account ID: <span className="font-mono text-xs bg-black/20 p-1 rounded">{status?.instagram?.user_id}</span>.</p>
                                </div>
                            </div>
                            <Button variant="secondary" className="w-full text-sm" onClick={() => {
                                setStatus(prev => prev ? { ...prev, instagram: { connected: false, status: "disconnected" } } : null);
                            }}>
                                Actualizar Credenciales
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleConnectInstagram} className="space-y-4">

                            {errorMsg && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            {successMsg && (
                                <div className="p-3 bg-pine-500/10 border border-pine-500/20 text-pine-400 text-sm rounded-lg flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{successMsg}</span>
                                </div>
                            )}

                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-gray-400 mb-2 space-y-2">
                                <p className="flex items-center gap-1.5 font-semibold text-gray-300">
                                    <Lock className="w-3 h-3" /> Encriptación AES-256
                                </p>
                                <p>Crea una App en developers.facebook.com, añade el producto "Instagram Graph API" y genera un token de acceso a nivel de página.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                    Instagram User ID (Opcional MVP)
                                </label>
                                <input
                                    type="text"
                                    name="instagramUserId"
                                    value={form.instagramUserId}
                                    onChange={handleChange}
                                    placeholder="Ej. 178414000000000"
                                    className="w-full px-3 py-2 bg-cinematic-deep border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pine-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                    Instagram Business Account ID
                                </label>
                                <input
                                    type="text"
                                    name="instagramBusinessAccountId"
                                    value={form.instagramBusinessAccountId}
                                    onChange={handleChange}
                                    placeholder="Ej. 178414000000000"
                                    className="w-full px-3 py-2 bg-cinematic-deep border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pine-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                    Page Access Token
                                </label>
                                <textarea
                                    name="instagramAccessToken"
                                    value={form.instagramAccessToken}
                                    onChange={handleChange}
                                    placeholder="EAAOXXXXXX..."
                                    rows={3}
                                    className="w-full px-3 py-2 bg-cinematic-deep border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pine-500/50 resize-none font-mono"
                                />
                            </div>

                            <Button type="submit" disabled={submitting} className="w-full mt-2">
                                {submitting ? "Conectando con Meta..." : "Conectar Instagram y Validar"}
                            </Button>
                        </form>
                    )}
                </GlassCard>

                {/* WHATSAPP CARD (Próximamente) */}
                <GlassCard strong className="opacity-70">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-glow">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white">WhatsApp API</h3>
                            <p className="text-sm text-pine-400 font-medium tracking-widest uppercase mt-1">
                                Próximamente
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-gray-400">
                            La integración nativa multicanal con la API de WhatsApp Business estará disponible en la Fase 2 del despliegue. Por el momento el RAG Engine prioriza cuentas creadoras B2B en Instagram.
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Phone Number ID
                            </label>
                            <input disabled placeholder="Bloqueado en MVP" className="w-full px-3 py-2 bg-black/40 border border-white/5 rounded-lg text-sm cursor-not-allowed" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Access Token
                            </label>
                            <input disabled placeholder="Bloqueado en MVP" className="w-full px-3 py-2 bg-black/40 border border-white/5 rounded-lg text-sm cursor-not-allowed" />
                        </div>

                        <Button disabled className="w-full mt-2 bg-white/5 text-gray-500 hover:bg-white/5 border-transparent">
                            Conectar WhatsApp
                        </Button>
                    </div>
                </GlassCard>

            </div>
        </div>
    );
}
