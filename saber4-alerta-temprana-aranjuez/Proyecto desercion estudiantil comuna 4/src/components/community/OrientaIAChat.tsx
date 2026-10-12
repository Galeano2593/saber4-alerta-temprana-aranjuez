import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, GraduationCap, Coins, Briefcase, MapPin, Globe } from 'lucide-react';
import { SectionHeading } from './InteractiveMap';

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

const QUICK_OPTIONS = [
  { id: 'carreras', label: 'Carreras de Software en ITM', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'becas', label: 'Becas Sapiencia y Matrícula Cero', icon: <Coins className="w-4 h-4" /> },
  { id: 'empleo', label: 'Empleo Joven y Agencia SENA', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'orientacion', label: '¿No sabes qué estudiar?', icon: <Sparkles className="w-4 h-4" /> },
];

function getLocalFallback(userText: string): string {
  const norm = userText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  if (norm.includes('soft') || norm.includes('progra') || norm.includes('itm') || norm.includes('desarro') || norm.includes('carrera')) {
    return 'El ITM ofrece programas tecnológicos destacados como Desarrollo de Software y Sistemas de Información (6 semestres). El SENA también ofrece la tecnología ADSO 100% gratuita. ¿Quieres información sobre requisitos de ingreso?';
  }
  if (norm.includes('beca') || norm.includes('sapien') || norm.includes('gratu') || norm.includes('pago') || norm.includes('matri')) {
    return 'En la Comuna 4 puedes postularte a Matrícula Cero para IES públicas (ITM, Pascual Bravo, Colegio Mayor) y becas Sapiencia. Los requisitos principales son vivir en estrato 1, 2 o 3 y ser bachiller de un colegio de Medellín.';
  }
  if (norm.includes('empleo') || norm.includes('traba') || norm.includes('sena') || norm.includes('hoja')) {
    return 'Para oportunidades laborales jóvenes puedes consultar la Agencia Pública de Empleo SENA, las convocatorias de talento TI en Ruta N y las asesorías del Valle del Software en Aranjuez.';
  }
  return 'Soy OrientaIA. Puedo orientarte sobre carreras del ITM, convocatorias SENA, becas de Sapiencia y opciones de empleo para jóvenes en Medellín.';
}

export default function OrientaIAChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'bot',
      text: '¡Hola! Soy OrientaIA, tu orientador vocacional en tiempo real. Puedo brindarte información sobre convocatorias del ITM, becas de Sapiencia, ofertas del SENA y empleo joven en Medellín. ¿En qué te asesoro hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error('API_KEY_MISSING');
      }

      // Estructura de historial compatible
      const conversationHistory = messages.slice(-6).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const systemPrompt = `Eres OrientaIA, el orientador vocacional inteligente del proyecto SIAD Aranjuez (Comuna 4, Medellín). Orientas a jóvenes sobre la oferta académica del ITM, SENA, Pascual Bravo, becas Sapiencia, Matrícula Cero y empleo joven. Responde siempre de forma amigable, clara, directa y breve (máximo 2 párrafos).`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `Instrucción del sistema: ${systemPrompt}` }]
              },
              ...conversationHistory,
              {
                role: 'user',
                parts: [{ text }]
              }
            ]
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        console.error('Gemini API Error:', data.error);
        throw new Error(data.error.message || 'API_RESPONSE_ERROR');
      }

      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!botText) {
        throw new Error('EMPTY_RESPONSE');
      }

      setMessages((m) => [...m, { id: Date.now() + 1, role: 'bot', text: botText }]);
    } catch (error: any) {
      console.error('Error en OrientaIA:', error);
      const fallbackResponse = getLocalFallback(text);
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'bot', text: fallbackResponse }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <SectionHeading
        eyebrow="OrientaIA en Vivo"
        title="Tu Orientador Vocacional Inteligente"
        subtitle="Asistente con inteligencia artificial para orientarte sobre inscripciones, becas de Sapiencia y oportunidades laborales en la Comuna 4."
      />

      <div className="mt-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
          {/* Encabezado */}
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-primary-700 to-primary-600">
            <div className="w-10 h-10 rounded-xl bg-white/15 ring-1 ring-white/30 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white flex items-center gap-2">
                OrientaIA
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/30 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  <Globe className="w-3 h-3 text-emerald-300" /> Web en Vivo
                </span>
              </p>
              <p className="text-xs text-primary-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" /> Conectado a Gemini API
              </p>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-white ring-1 ring-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white ring-1 ring-slate-200 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Globe className="w-3.5 h-3.5 text-primary-600 animate-spin" /> Procesando respuesta con IA...
                </div>
              </motion.div>
            )}
          </div>

          {/* Opciones rápidas */}
          <div className="px-4 py-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto">
            {QUICK_OPTIONS.map((o) => (
              <button
                key={o.id}
                onClick={() => send(o.label)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold ring-1 ring-primary-200 hover:bg-primary-100 transition-colors whitespace-nowrap shrink-0"
              >
                {o.icon}
                {o.label}
              </button>
            ))}
          </div>

          {/* Caja de texto */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 p-3 bg-white border-t border-slate-100"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Haz tu consulta en vivo (ej: cuando abren inscripciones en el ITM)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 ring-primary-500"
            />
            <button
              type="submit"
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center shadow-md shadow-primary-500/30 hover:scale-105 transition-transform"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        <p className="mt-3 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
          <MapPin className="w-3 h-3" /> OrientaIA SIAD Aranjuez — Impulsado por Google Gemini API.
        </p>
      </div>
    </section>
  );
}
