"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users,
    LayoutDashboard,
    MessageSquare,
    KanbanSquare,
    LogOut,
    Bot
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Clientes & Agentes", href: "/dashboard/clients", icon: Users },
        { name: "Pipeline", href: "/dashboard/pipeline", icon: KanbanSquare },
        { name: "Integraciones", href: "/dashboard/integrations", icon: Bot },
        { name: "Inbox DM", href: "/dashboard/inbox", icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-cinematic-deep flex text-gray-200 font-sans selection:bg-pine-500/30">
            {/* Sidebar */}
            <div className="w-64 bg-cinematic-surface border-r border-white/5 flex flex-col h-screen sticky top-0">
                <div className="h-20 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-pine-600 flex items-center justify-center text-white shadow-glow">
                            <Bot className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-lg text-white tracking-wide">Growth Agent</span>
                    </div>
                </div>

                <div className="p-4 flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 px-2 mt-4">Navegación</p>
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                        ? "bg-pine-500/10 text-pine-400 border border-pine-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <item.icon className={`w-4 h-4 ${isActive ? "text-pine-400" : "text-gray-500"}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                {/* Subtle background glow effect for the main area */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-background-radial-glow opacity-40 pointer-events-none" />

                {/* Topbar */}
                <header className="h-20 bg-cinematic-surface/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-sm font-medium text-gray-300">Entorno B2B</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-white">Administrador</p>
                            <p className="text-xs text-pine-400">Growth Operator</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-cinematic-deep border border-pine-500/30 flex items-center justify-center text-pine-500 shadow-glow">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
