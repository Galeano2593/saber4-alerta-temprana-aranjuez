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
  { id: 'carreras', label: 'Carreras de Software y Tecnología en ITM', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'becas', label: 'Becas Sapiencia y Matrícula Cero', icon: <Coins className="w-4 h-4" /> },
  { id: 'empleo', label: 'Empleo Joven y Agencia SENA', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'orientacion', label: '¿No sabes qué estudiar? Test Rápido', icon: <Sparkles className="w-4 h-4" /> },
];

function cleanText(txt: string): string {
  return txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function resolveAIResponse(userText: string): string {
  const norm = cleanText(userText);

  // 1. Desarrollo de Software / Programación / ITM
  if (norm.includes('soft') || norm.includes('progra') || norm.includes('siste') || norm.includes('itm') || norm.includes('code') || norm.includes('desarro')) {
    return 'El ITM (Instituto Tecnológico Metropolitano) ofrece programas clave en tecnología como la Tecnología en Desarrollo de Software y la Tecnología en Sistemas de Información. Son carreras de 6 semestres con alta inserción laboral en Medellín. Además, el SENA ofrece la Tecnología en Análisis y Desarrollo de Software (ADSO) 100% gratuita. ¿Deseas saber las fechas del próximo proceso de admisión?';
  }

  // 2. Becas / Sapiencia / Matrícula Cero / Financiación
  if (norm.includes('beca') || norm.includes('sapien') || norm.includes('gratu') || norm.includes('pagar') || norm.includes('epm') || norm.includes('plata') || norm.includes('dinero')) {
    return 'Para estudiar gratis o con apoyo económico en Aranjuez y Comuna 4 cuentas con: 1) Matrícula Cero de la Alcaldía de Medellín para IES públicas (ITM, Pascual Bravo, Colegio Mayor), 2) Fondo Beca Tecnologías Sapiencia, 3) Fondos Presupuesto Participativo de la Comuna 4. Requisitos principales: vivir en estrato 1, 2 o 3 y haber egresado de un colegio oficial. ¿Te gustaría conocer el calendario de postulaciones de Sapiencia?';
  }

  // 3. Empleo / Trabajo / Experiencia / SENA / Prácticas
  if (norm.includes('empleo') || norm.includes('traba') || norm.includes('chamba') || norm.includes('hoja') || norm.includes('camara') || norm.includes('sena')) {
    return 'Para ingresar al mercado laboral siendo joven en la Comuna 4 dispones de: 1) Agencia Pública de Empleo del SENA con vacantes para aprendices, 2) Ruta N con programas de formación exprés en tecnología e inserción directa, 3) Centro del Valle de Software Aranjuez con asesoría para emprendimiento y primer empleo. ¿Quieres consejos para estructurar tu hoja de vida sin experiencia previa?';
  }

  // 4. Orientación / Dudas / No sé qué estudiar
  if (norm.includes('orienta') || norm.includes('estudia') || norm.includes('nose') || norm.includes('no se') || norm.includes('gust') || norm.includes('ayuda')) {
    return '¡Es perfectamente normal dudar! Vamos a definir tu perfil con 3 preguntas rápidas: 1) ¿Prefieres resolver problemas lógicos y tecnología, trabajar con personas en salud/comunidad, o el diseño y la creatividad? 2) ¿Prefieres una carrera corta (técnica/tecnológica de 2-3 años) o profesional? Respóndeme con tus gustos y te mostraré las 3 mejores opciones activas en Medellín.';
  }

  // 5. Inscripciones / Requisitos / Documentos
  if (norm.includes('inscri') || norm.includes('requisi') || norm.includes('documen') || norm.includes('fech') || norm.includes('pape')) {
    return 'Los requisitos generales para ingresar a la educación superior pública en Medellín son: 1) Fotocopia del documento de identidad, 2) Acta de grado o diploma de bachiller, 3) Pruebas Saber 11 (Icfes), 4) Cuenta de servicios públicos reciente para certificar residencia e historia socioeconómica. ¿A qué institución deseas postularte?';
  }

  // Respuesta por defecto enriquecida
  return 'Hola, soy OrientaIA, el orientador vocacional del SIAD Aranjuez. Puedo asesorarte con detalle sobre ofertas académicas del ITM y SENA, becas de Sapiencia, empleo joven y orientación vocacional. Escribe tu pregunta sobre carreras, inscripciones o becas y te guiaré con datos reales de la Comuna 4.';
}

export default function OrientaIAChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'bot',
      text: '¡Hola! Soy OrientaIA, tu orientador vocacional en la Comuna 4. Puedo ayudarte a resolver dudas sobre carreras técnicas en el ITM, becas de Sapiencia, empleo joven en Medellín u orientación si no estás seguro de qué estudiar. ¿En qué te puedo asesorar hoy?',
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

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    const botReply = resolveAIResponse(text);

    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'bot', text: botReply }]);
    }, 900);
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
          {/* Header */}
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

          {/* Mensajes */}
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
                <div className="bg-white ring-1 ring-slate-200 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1.5">
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

          {/* Caja de entrada */}
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
              placeholder="Escribe tu duda (ej: becas, desarrollo de software, SENA)..."
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
          <MapPin className="w-3 h-3" /> OrientaIA - Asistente de Orientación Vocacional SIAD Comuna 4 Aranjuez.
        </p>
      </div>
    </section>
  );
}
