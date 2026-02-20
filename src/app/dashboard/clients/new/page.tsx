"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default function NewClientPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        niche: "",
        channels: "instagram"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/dashboard/clients");
                router.refresh();
            } else {
                alert("Error al crear cliente");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/dashboard/clients" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-400 hover:text-white transition">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Crear Nuevo Cliente</h1>
                    <p className="text-gray-400 mt-1 font-light">
                        Añade una nueva marca o agencia para gestionarla de forma aislada.
                    </p>
                </div>
            </div>

            <GlassCard strong>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de la Marca / Empresa</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-cinematic-deep border border-white/10 rounded-xl focus:ring-2 focus:ring-pine-500/50 transition-all text-sm text-white focus:outline-none"
                                placeholder="Ej. Acme Corp Software"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Industria / Nicho</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-cinematic-deep border border-white/10 rounded-xl focus:ring-2 focus:ring-pine-500/50 transition-all text-sm text-white focus:outline-none"
                                placeholder="Ej. SaaS B2B, Agencia de Marketing"
                                value={formData.niche}
                                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Canal Principal</label>
                            <select
                                className="w-full px-4 py-3 bg-cinematic-deep border border-white/10 rounded-xl focus:ring-2 focus:ring-pine-500/50 transition-all text-sm text-white focus:outline-none"
                                value={formData.channels}
                                onChange={(e) => setFormData({ ...formData, channels: e.target.value })}
                            >
                                <option value="instagram">Instagram DM</option>
                                <option value="whatsapp">WhatsApp (Próximamente)</option>
                            </select>
                            <p className="mt-2 text-xs text-gray-500">Agregaremos más canales multi-agente en futuras actualizaciones.</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                        <Link href="/dashboard/clients">
                            <Button type="button" variant="ghost">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={loading}>
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? "Guardando..." : "Crear Cliente"}
                        </Button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}
