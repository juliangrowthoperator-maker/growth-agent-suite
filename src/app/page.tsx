"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DemoChat } from "@/components/ui/DemoChat";
import { ArrowRight, MessageSquare, Target, Zap, Bot, Users, Activity, CheckCircle2, ChevronDown, AlertTriangle, ShieldCheck, PhoneCall, SlidersHorizontal, Layers, ServerCog, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cinematic-deep selection:bg-pine-500/30 font-sans">

      {/* Navbar with Anchors */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 lg:px-12 py-4 flex justify-between items-center bg-cinematic-surface/80 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-pine-500 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <Bot className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-wide text-white">The Forge</span>
        </Link>
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">Cómo funciona</a>
          <a href="#includes" className="hover:text-white transition-colors">Qué incluye</a>
          <a href="#use-cases" className="hover:text-white transition-colors">Casos de uso</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition">
            Iniciar Sesión
          </Link>
          <Link href="/register">
            <Button variant="glass" size="sm">Aplicar a The Forge</Button>
          </Link>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[100svh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-luminosity duration-1000"
          style={{ backgroundImage: "url('/forest-bg.jpg')", backgroundColor: "#021c1e" }}
        />
        <div className="absolute inset-0 z-0 bg-hero-gradient" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter leading-[1.05]">
              The Forge: <br />
              <span className="text-gradient-gold">tu sistema operativo</span><br />
              de adquisición y ventas con agentes AI
            </h1>
            <p className="text-lg text-gray-300 font-light leading-relaxed">
              (WhatsApp + Instagram)
              <br /><br />
              Para creators y agencias que venden por conversación: responde en segundos, califica con criterio y convierte DMs en llamadas (sin perder tu tono de marca).
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg hover:scale-105 shadow-glow">
                  Aplicar a The Forge <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Ver cómo funciona
                </Button>
              </a>
            </div>

            <p className="text-sm font-medium text-pine-400 font-light flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Nota: Playbooks + implementación guiada + un stack que puedes operar tú.
            </p>
          </div>

          <div className="relative lg:ml-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            <div className="absolute -inset-1 bg-gradient-to-r from-pine-500 to-cinematic-blue rounded-3xl blur-2xl opacity-20"></div>
            <GlassCard strong glow className="relative border-t border-white/20 shadow-2xl space-y-6 p-8">
              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-pine-500/20 flex items-center justify-center border border-pine-500/30 shrink-0 mt-1">
                    <Target className="w-4 h-4 text-pine-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Convierte conversaciones en pipeline</h4>
                    <p className="text-gray-400 text-sm mt-1">etiquetas, contexto y próximos pasos claros.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-cinematic-blue/20 flex items-center justify-center border border-cinematic-blue/30 shrink-0 mt-1">
                    <MessageSquare className="w-4 h-4 text-cinematic-blue" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Agente entrenado en tu oferta</h4>
                    <p className="text-gray-400 text-sm mt-1">responde, pregunta lo correcto y detecta intención.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-cinematic-accent/20 flex items-center justify-center border border-cinematic-accent/30 shrink-0 mt-1">
                    <ShieldCheck className="w-4 h-4 text-cinematic-accent" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Intervención humana cuando importa</h4>
                    <p className="text-gray-400 text-sm mt-1">toma el control en 1 clic y cierra.</p>
                  </div>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 2. PROBLEMA */}
      <section className="relative py-32 px-6 lg:px-12 z-10 bg-cinematic-surface border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Si tu canal es DM, tu ventaja es la velocidad (y el sistema)"
            subtitle="Responder tarde te cuesta leads. Responder rápido sin proceso te cuesta cierres. Y automatizar 'a medias' te cuesta confianza."
            align="left"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <GlassCard className="border-red-500/20 bg-red-500/5 hover:border-red-500/40 transition-colors group">
              <AlertTriangle className="w-8 h-8 text-red-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-bold mb-2">Respuestas inconsistentes</h4>
              <p className="text-gray-400 text-sm">Cada persona "improvisa" el discurso.</p>
            </GlassCard>
            <GlassCard className="border-red-500/20 bg-red-500/5 hover:border-red-500/40 transition-colors group">
              <MessageSquare className="w-8 h-8 text-red-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-bold mb-2">Mucho chat, poca intención</h4>
              <p className="text-gray-400 text-sm">Calificación débil.</p>
            </GlassCard>
            <GlassCard className="border-red-500/20 bg-red-500/5 hover:border-red-500/40 transition-colors group">
              <PhoneCall className="w-8 h-8 text-red-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-bold mb-2">Citas que no se presentan</h4>
              <p className="text-gray-400 text-sm">Falta de preparación y fricción.</p>
            </GlassCard>
            <GlassCard className="border-red-500/20 bg-red-500/5 hover:border-red-500/40 transition-colors group">
              <Activity className="w-8 h-8 text-red-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-bold mb-2">Cero visibilidad</h4>
              <p className="text-gray-400 text-sm">No sabes qué pasa hasta que es tarde.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 3. SOLUCION */}
      <section className="relative py-32 px-6 lg:px-12 z-10 bg-cinematic-deep">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="The Forge convierte conversaciones en un flujo predecible"
            subtitle="The Forge une 3 capas que normalmente están separadas: agente AI + pipeline operativo + control humano."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <GlassCard className="relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pine-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 bg-pine-500/10 rounded-2xl flex items-center justify-center text-pine-400 mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Agente AI</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Responde, pregunta y guía hacia el siguiente paso.
              </p>
            </GlassCard>

            <GlassCard className="relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 delay-100 text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cinematic-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 bg-cinematic-blue/10 rounded-2xl flex items-center justify-center text-cinematic-blue mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pipeline</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Estados claros, seguimiento y contexto para no perder oportunidades.
              </p>
            </GlassCard>

            <GlassCard className="relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 delay-200 text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cinematic-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 bg-cinematic-accent/10 rounded-2xl flex items-center justify-center text-cinematic-accent mb-6 mx-auto group-hover:scale-110 transition-transform">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Control humano</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Pausa, intervén y retoma cuando el cierre lo necesita.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 4. DEMO INTERACTIVA */}
      <section id="demo" className="relative py-32 px-6 lg:px-12 bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionTitle
              title="Pruébalo ahora: habla con el agente de The Forge"
              subtitle="Hazle preguntas reales. Te responderá como lo haría en una implementación: entiende tu caso, filtra intención y te lleva al siguiente paso."
            />
            {/* Disclaimer in Subtitle/Microcopy */}
            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-pine-400 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                <strong className="text-white">Demo pública:</strong> no compartas datos sensibles. Para una configuración a tu medida, aplica y lo vemos.
              </p>
            </div>
          </div>

          <div className="relative w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <DemoChat />
            </div>
          </div>
        </div>
      </section>

      {/* 5. CÓMO FUNCIONA */}
      <section id="how-it-works" className="relative py-32 px-6 lg:px-12 z-10 bg-cinematic-deep">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Cómo funciona"
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            <GlassCard className="relative overflow-hidden">
              <div className="text-5xl font-bold text-white/5 absolute -top-4 -right-2">01</div>
              <h4 className="text-white font-bold text-lg mb-3">Diagnóstico de oferta y canal</h4>
              <p className="text-gray-400 text-sm">Definimos ICP, promesa, objeciones y triggers de intención.</p>
            </GlassCard>
            <GlassCard className="relative overflow-hidden">
              <div className="text-5xl font-bold text-white/5 absolute -top-4 -right-2">02</div>
              <h4 className="text-white font-bold text-lg mb-3">Entrenamiento del agente</h4>
              <p className="text-gray-400 text-sm">(Con tu voz): alineado a copy, reglas y límites, cuándo escalar.</p>
            </GlassCard>
            <GlassCard className="relative overflow-hidden">
              <div className="text-5xl font-bold text-white/5 absolute -top-4 -right-2">03</div>
              <h4 className="text-white font-bold text-lg mb-3">Pipeline + automatizaciones mínimas</h4>
              <p className="text-gray-400 text-sm">Estados, etiquetas, seguimiento.</p>
            </GlassCard>
            <GlassCard className="relative overflow-hidden">
              <div className="text-5xl font-bold text-white/5 absolute -top-4 -right-2">04</div>
              <h4 className="text-white font-bold text-lg mb-3">Operación semanal</h4>
              <p className="text-gray-400 text-sm">Iteramos con conversaciones reales.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 6. QUÉ INCLUYE */}
      <section id="includes" className="py-32 px-6 lg:px-12 bg-cinematic-surface border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Qué incluye"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {[
              "Playbooks de conversación: apertura, calificación, objeciones, cierre.",
              "Plantillas de pipeline + criterios de calificación.",
              "Agente AI para WhatsApp e Instagram (con intervención humana).",
              "Guardrails: reglas y límites para mantener calidad.",
              "Onboarding + soporte de implementación.",
              "Panel de Inbox para operar sin caos."
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 p-5 rounded-2xl">
                <CheckCircle2 className="w-5 h-5 text-pine-400 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-gray-200 leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CASOS DE USO */}
      <section id="use-cases" className="relative py-32 overflow-hidden bg-cinematic-deep">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-background-radial-glow opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <SectionTitle
            title="Casos de uso"
            className="mb-20"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard strong>
              <Users className="w-8 h-8 text-pine-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Creators</h3>
              <p className="text-gray-300">Convierte "precio?" en conversaciones que terminan en llamada o checkout.</p>
            </GlassCard>

            <GlassCard strong>
              <ServerCog className="w-8 h-8 text-pine-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Agencias</h3>
              <p className="text-gray-300">Califica, agenda y entrega contexto al closer.</p>
            </GlassCard>

            <GlassCard strong>
              <Target className="w-8 h-8 text-pine-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Servicios B2B</h3>
              <p className="text-gray-300">Acelera speed-to-lead con control humano.</p>
            </GlassCard>

            <GlassCard strong>
              <Zap className="w-8 h-8 text-pine-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Lanzamientos</h3>
              <p className="text-gray-300">Absorbe picos de DMs y prioriza intención.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 8. COMPARATIVA */}
      <section className="py-32 px-6 lg:px-12 bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Comparativa"
            align="center"
          />
          <div className="mt-16 bg-cinematic-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="p-8 pb-10">
                <h4 className="font-bold text-gray-300 mb-4 text-lg">DIY automatizaciones</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Inconsistente y difícil de mantener.</p>
              </div>
              <div className="p-8 pb-10">
                <h4 className="font-bold text-gray-300 mb-4 text-lg">Solo CRM</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Ordena, pero no conversa ni califica en tiempo real.</p>
              </div>
              <div className="p-8 pb-10">
                <h4 className="font-bold text-gray-300 mb-4 text-lg">SDRs humanos</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Cuesta más y escala más lento.</p>
              </div>
              <div className="p-8 pb-10 bg-pine-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-pine-500/20 rounded-bl-full"></div>
                <h4 className="font-bold text-white mb-4 text-lg text-pine-400">The Forge</h4>
                <p className="text-gray-200 text-sm leading-relaxed font-medium">Conversación + sistema + operación (con control humano).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section id="faq" className="py-32 px-6 lg:px-12 bg-cinematic-deep">
        <div className="max-w-3xl mx-auto">
          <SectionTitle
            title="FAQ"
            align="center"
          />
          <div className="space-y-4 mt-12">
            {[
              { q: "¿The Forge es software o programa?", a: "Es una solución híbrida: te entregamos el software (sistema multi-agente + inbox) y los playbooks exactos de implementación." },
              { q: "¿Funciona para creators y agencias?", a: "Sí, la flexibilidad del RAG (Base de Conocimiento) permite entrenar al agente tanto para vender servicios high-ticket como para dirigir tráfico a checkouts de infoproductos." },
              { q: "¿En qué canales funciona?", a: "Instagram DM y WhatsApp." },
              { q: "¿Puedo intervenir en la conversación?", a: "Por supuesto. El sistema tiene un botón de 'Pausar IA' que te permite tomar el control humano al instante." },
              { q: "¿Cómo evitan respuestas 'inventadas'?", a: "A través de 'Guardrails' estrictos. Si el agente no encuentra la respuesta en tu base de conocimiento, está programado para no inventarla y escalar a un humano." },
              { q: "¿Necesito saber programar?", a: "No. The Forge operará a través del Dashboard fácil de usar que te instalaremos." },
              { q: "¿Cuánto tarda en implementarse?", a: "Con nuestro soporte guiado, puedes tener los flujos activos y el RAG entrenado en los primeros días." },
              { q: "¿Esto reemplaza a mi closer?", a: "No. Reemplaza el trabajo manual previo a la llamada: descubrir, filtrar, y agendar. Tu Closer entrará a jugar con personas altamente cualificadas." },
              { q: "¿Qué necesito para aplicar?", a: "Tener tráfico/atención demostrable en IG o WhatsApp, y un proceso de ventas o producto validado." },
              { q: "¿Puedo empezar simple y escalar después?", a: "Totalmente, comenzamos con el escenario (Caso de Uso) de mayor dolor y expandimos el alcance operativo semana a semana." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer text-white open:bg-white/10 transition-colors">
                <summary className="font-semibold text-lg flex justify-between items-center list-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-gray-400 mt-4 leading-relaxed text-sm">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA FINAL */}
      <section className="relative py-40 flex items-center justify-center text-center overflow-hidden border-t border-white/5 bg-black/60">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#010a0d]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-pine-500/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl px-6">
          <SectionTitle
            title="Si vendes por DMs, necesitas un sistema (no más fuerza de voluntad)"
            subtitle="Aplica a The Forge y te devolvemos un plan claro: qué automatizar, qué dejar humano y cómo operarlo semana a semana."
            align="center"
          />
          <Link href="/register" className="inline-block mt-8">
            <Button size="lg" className="text-lg px-12 py-5 font-bold hover:scale-105 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              Aplicar a The Forge
            </Button>
          </Link>
          <p className="text-sm text-gray-400 mt-6 font-medium tracking-wide text-pine-400">
            Respuesta en 24–48h. Cupos limitados por implementación.
          </p>
        </div>
      </section>

      <footer className="py-12 text-center bg-[#010a0d] border-t border-white/5">
        <div className="flex justify-center gap-6 mb-6 text-sm text-gray-500 font-medium">
          <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
          <Link href="#" className="hover:text-white transition-colors">Términos</Link>
          <Link href="#" className="hover:text-white transition-colors">Contacto</Link>
        </div>
        <p className="text-sm text-gray-600 font-medium">
          © {new Date().getFullYear()} The Forge
        </p>
        <p className="text-xs text-gray-700 mt-2 font-light">
          Construido para operar — no para impresionar.
        </p>
      </footer>
    </div>
  );
}
