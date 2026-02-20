"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                router.push("/login?registered=1");
            } else {
                const data = await res.json();
                setError(data.message || "Error al registrarse");
            }
        } catch (err) {
            setError("Error de red.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-10 mx-4">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/20">
                        <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Crea tu cuenta</h1>
                    <p className="text-gray-500 text-sm mt-1">Growth Agent Suite</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                            Nombre o Agencia
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900"
                            placeholder="Mi Agencia LLC"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900"
                            placeholder="tu@agencia.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-2"
                    >
                        {loading ? "Registrando..." : "Registrarse gratis"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-8">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/login" className="text-emerald-600 font-medium hover:text-emerald-700 transition">
                        Inicia Sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
