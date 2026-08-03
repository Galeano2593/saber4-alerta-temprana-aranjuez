import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, GraduationCap, Coins, Briefcase, MapPin } from 'lucide-react';
import { SectionHeading } from './InteractiveMap';

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

const QUICK_OPTIONS = [
  { id: 'carreras', label: 'Carreras técnicas en el ITM', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'becas', label: 'Becas locales en Medellín', icon: <Coins className="w-4 h-4" /> },
  { id: 'empleo', label: 'Rutas de empleo joven', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'orientacion', label: 'No sé qué estudiar', icon: <Sparkles className="w-4 h-4" /> },
];

const RESPONSES: Record<string, string> = {
  carreras:
    'En el ITM (Institución Universitaria Pascual Bravo) y el SENA hay carreras técnicas y tecnológicas ideales para la Comuna 4: Análisis y Desarrollo de Software, Mantenimiento de Equipos de Cómputo, Sistemas de Telecomunicaciones, y Tecnología en Electricidad. Muchas ofrecen jornada nocturna para que puedas trabajar y estudiar. ¿Quieres que te detalle los requisitos de inscripción?',
  becas:
    'En Medellín existen varias becas para jóvenes de la Comuna 4: la Beca "Medellín Convive" del Municipio, los programas de la Alcaldía de Medellín a través de la Secretaría de Educación, y los apoyos de Sapiencia para educación superior. También el Inder y la Comuna 4 ofrecen cupos en programas de formación. ¿Te ayudo a revisar cuáles se ajustan a tu promedio?',
  empleo:
    'Para conseguir empleo siendo joven en Aranjuez te recomiendo: 1) Inscribir tu hoja de vida en el Agencia de Empleo de la Cámara de Comercio, 2) Programas de primer empleo del Municipio, 3) Aprendices SENA — muchas empresas de la zona buscan técnicos y tecnólogos, 4) Ferias de empleo que se hacen en el Parque de Aranjuez. ¿Quieres que te diga cómo armar tu hoja de vida?',
  orientacion:
    '¡Tranquilo, es normal! Para orientarte podemos empezar con tres preguntas: ¿Qué materias te gustan más? ¿Prefieres trabajar con personas, máquinas o ideas? ¿Te gustaría estudiar algo corto (técnico) o largo (profesional)? Cuéntame y te sugiero rutas reales que existen aquí en Medellín.',
  default:
    'Soy OrientaIA, tu orientador vocacional. Puedo ayudarte con carreras técnicas del ITM, becas locales en Medellín, rutas de empleo joven y orientación si no sabes qué estudiar. Toca uno de los botones de abajo para empezar.',
};

export default function OrientaIAChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'bot', text: RESPONSES.default },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    const key = QUICK_OPTIONS.find((o) => text.includes(o.label))?.id ?? 'default';
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'bot', text: RESPONSES[key] }]);
    }, 1100);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <SectionHeading
        eyebrow="OrientaIA"
        title="Tu Orientador Vocacional con IA"
        subtitle="Un asistente inteligente que conversa con los jóvenes de la Comuna 4 sobre carreras técnicas, becas locales y rutas de empleo reales en Medellín."
      />

      <div className="mt-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-primary-700 to-primary-600">
            <div className="w-10 h-10 rounded-xl bg-white/15 ring-1 ring-white/30 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white">OrientaIA</p>
              <p className="text-xs text-primary-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" /> En línea
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-white ring-1 ring-slate-200 text-slate-700 rounded-bl-sm'
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white ring-1 ring-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 rounded-full bg-slate-300"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick options */}
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

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 p-3 bg-white border-t border-slate-100"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta…"
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
          <MapPin className="w-3 h-3" /> OrientaIA es una demostración con respuestas simuladas para la Comuna 4.
        </p>
      </div>
    </section>
  );
}
