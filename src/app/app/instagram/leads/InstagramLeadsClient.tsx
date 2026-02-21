"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Send, Bot, Archive, UserCircle2, ArrowLeft, Clock, MessageSquare } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Message {
    id: string;
    senderType: "lead" | "agent" | "human";
    textContent: string;
    timestamp: string;
}

interface Lead {
    id: string;
    username: string;
    messages: Message[];
    lastMessageText: string;
    lastMessageTimestamp: string;
    status: string;
}

export default function InstagramLeadsClient() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [filter, setFilter] = useState("all"); // "all", "pending", "answered", "archived"
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [manualMessage, setManualMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    const fetchLeads = async () => {
        try {
            const res = await fetch(`/api/instagram/leads?status=${filter}`);
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
                if (selectedLead) {
                    const updated = data.find((l: Lead) => l.id === selectedLead.id);
                    if (updated) setSelectedLead(updated);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
        const interval = setInterval(fetchLeads, 15000);
        return () => clearInterval(interval);
    }, [filter]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedLead?.messages]);

    const handleActivateAgent = async () => {
        if (!selectedLead) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/instagram/activate-agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lead_id: selectedLead.id })
            });
            if (res.ok) {
                await fetchLeads();
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleSendManual = async () => {
        if (!selectedLead || !manualMessage.trim()) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/instagram/send-manual", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lead_id: selectedLead.id, message_text: manualMessage })
            });
            if (res.ok) {
                setManualMessage("");
                await fetchLeads();
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleArchive = async () => {
        if (!selectedLead) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/instagram/archive-lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lead_id: selectedLead.id })
            });
            if (res.ok) {
                setSelectedLead(null);
                await fetchLeads();
            }
        } finally {
            setActionLoading(false);
        }
    };

    const filteredLeads = leads.filter(l => l.username.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="flex h-screen bg-cinematic-deep text-white overflow-hidden">

            {/* SIDEBAR: LEADS LIST */}
            <div className={`w-full md:w-1/3 xl:w-1/4 border-r border-white/10 flex flex-col bg-cinematic-surface ${selectedLead ? 'hidden md:flex' : 'flex'}`}>

                {/* Header */}
                <div className="p-6 border-b border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold">Instagram Leads</h1>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 text-xs overflow-x-auto pb-2 scrollbar-hide">
                        {['all', 'pending', 'answered', 'archived'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border ${filter === f ? 'bg-pine-500/20 border-pine-500/50 text-pine-400' : 'bg-transparent border-white/10 text-gray-400 hover:text-white'}`}
                            >
                                {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : f === 'answered' ? 'Respondidos' : 'Archivados'}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar username..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-pine-500/50 transition-colors"
                        />
                    </div>
                </div>

                {/* Leads List */}
                <div className="flex-1 overflow-y-auto">
                    {loading && leads.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">Cargando leads...</div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">No se encontraron leads.</div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {filteredLeads.map(lead => (
                                <div
                                    key={lead.id}
                                    onClick={() => setSelectedLead(lead)}
                                    className={`p-4 cursor-pointer hover:bg-white/5 transition-colors flex gap-3 ${selectedLead?.id === lead.id ? 'bg-white/5 border-l-2 border-pine-500' : 'border-l-2 border-transparent'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 border border-pink-500/30">
                                        <UserCircle2 className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-semibold text-sm truncate pr-2">{lead.username}</p>
                                            <span className="text-[10px] text-gray-500 shrink-0 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(lead.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">{lead.lastMessageText}</p>
                                        <div className="mt-2 flex gap-1">
                                            {lead.status === 'descubierto' && <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full">Pendiente</span>}
                                            {lead.status === 'contactado' && <span className="text-[10px] bg-pine-500/10 text-pine-400 px-2 py-0.5 rounded-full">Respondido</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT: CHAT */}
            <div className={`w-full md:w-2/3 xl:w-3/4 flex flex-col bg-black/20 relative ${!selectedLead ? 'hidden md:flex' : 'flex'}`}>
                {!selectedLead ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                        <p>Selecciona un lead para ver la conversación</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/5 bg-cinematic-surface flex justify-between items-center z-10 w-full relative h-[72px] shrink-0">
                            <div className="flex items-center gap-3">
                                <button className="md:hidden p-2 -ml-2 text-gray-400" onClick={() => setSelectedLead(null)}>
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-pink-400 border border-pink-500/30">
                                    <UserCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">@{selectedLead.username}</p>
                                    <p className="text-xs text-pine-400">Instagram</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="secondary" size="sm" onClick={handleArchive} disabled={actionLoading}>
                                    <Archive className="w-4 h-4 md:mr-2" />
                                    <span className="hidden md:inline">Archivar</span>
                                </Button>
                                <Button
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    size="sm"
                                    onClick={handleActivateAgent}
                                    disabled={actionLoading}
                                >
                                    <Bot className="w-4 h-4 md:mr-2" />
                                    <span className="hidden md:inline">{actionLoading ? 'Generando...' : 'Responder con IA'}</span>
                                </Button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                            {selectedLead.messages.map((msg, i) => {
                                const isLead = msg.senderType === 'lead';
                                const isAgent = msg.senderType === 'agent';

                                return (
                                    <div key={msg.id || i} className={`flex ${isLead ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 ${isLead
                                                ? 'bg-white/5 border border-white/10 rounded-tl-sm'
                                                : isAgent
                                                    ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-50 rounded-tr-sm'
                                                    : 'bg-pine-600 text-white rounded-tr-sm'
                                            }`}>
                                            {isAgent && <div className="flex items-center gap-1 mb-1 text-[10px] text-indigo-300 font-semibold uppercase tracking-wider"><Bot className="w-3 h-3" /> Agente IA</div>}
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.textContent}</p>
                                            <span className={`text-[10px] mt-2 block opacity-50 ${isLead ? 'text-left' : 'text-right'}`}>
                                                {new Date(msg.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-cinematic-surface border-t border-white/10">
                            <form
                                onSubmit={e => { e.preventDefault(); handleSendManual(); }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={manualMessage}
                                    onChange={(e) => setManualMessage(e.target.value)}
                                    placeholder="Escribe un mensaje manual (ignora a la IA)..."
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pine-500/50"
                                    disabled={actionLoading}
                                />
                                <Button
                                    type="submit"
                                    disabled={!manualMessage.trim() || actionLoading}
                                    className="shrink-0 px-4"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
