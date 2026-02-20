"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Credenciales incorrectas.");
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-10 mx-4">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/20">
                        <LogIn className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Bienvenido de nuevo</h1>
                    <p className="text-gray-500 text-sm mt-1">Ingresa a Growth Agent Suite</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
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
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                Password
                            </label>
                            <Link href="#" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
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
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? "Cargando..." : "Iniciar Sesión"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-8">
                    ¿No tienes una cuenta?{" "}
                    <Link href="/register" className="text-emerald-600 font-medium hover:text-emerald-700 transition">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
}
