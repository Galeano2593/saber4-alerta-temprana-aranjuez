import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, GraduationCap, ExternalLink, RefreshCw, Sparkles,
  BookOpen, ShieldAlert, Briefcase, Building2, FileText
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  links?: { label: string; url: string }[];
  options?: string[];
}

// Banco de Preguntas Frecuentes y Respuestas Institucionales
const FAQ_DATABASE: Record<string, { text: string; links?: { label: string; url: string }[]; followUps?: string[] }> = {
  'rutas_desercion': {
    text: 'La **Ruta de Atención para la Permanencia Escolar en la Comuna 4** se activa según el Índice de Riesgo (IRTE C4):\n\n1. **Riesgo Medio (Acompañamiento):** Notificación al acudiente, tutoría académica y citación a orientación escolar.\n2. **Riesgo Crítico (Permanencia):** Remisión prioritaria al equipo psicosocial de la institución y reporte al comite de convivencia.\n3. **Factores Externos:** Notificación a la red comunitaria mediante la plataforma SATMED de la Alcaldía de Medellín.',
    links: [
      { label: 'Portal Oficial SATMED Medellín', url: 'https://www.medellin.gov.co' },
      { label: 'Manual de Protocolos de Permanencia (Alcaldía)', url: 'https://www.medellin.edu.co' }
    ],
    followUps: ['¿Cómo postular a Becas Sapiencia?', '¿Cómo articular con el ITM?']
  },
  'becas_sapiencia': {
    text: 'Sapiencia ofrece diversas oportunidades de financiamiento para estudiantes de grados 10.º y 11.º de la Comuna 4:\n\n• **Matrícula Cero:** Cobertura del 100% del valor de la matrícula en IES públicas de Medellín (ITM, Pascual Bravo, Colegio Mayor).\n• **Fondos EPM y Presupuesto Participativo:** Créditos condonables para educación superior y tecnología.\n• **Becas Mejores Bachilleres:** Apoyo directo a los mejores promedios académicos de las I.E. públicas.',
    links: [
      { label: 'Convocatorias y Portal Sapiencia', url: 'https://sapiencia.gov.co' },
      { label: 'Ver Requisitos de Matrícula Cero', url: 'https://sapiencia.gov.co/becas-2/' }
    ],
    followUps: ['¿Qué carreras ofrece el ITM?', '¿Qué es la Articulación Media SENA?']
  },
 'itm_software': {
    text: 'El **Instituto Tecnológico Metropolitano (ITM)** ofrece una amplia oferta académica de pregrados (tecnologías e ingenierías/licenciaturas) agrupada en sus 4 facultades principales:\n\n' +
          '• **Ingenierías:** Tecnología en Desarrollo de Software, Ingeniería de Sistemas, Mecatrónica, Electrónica, Telecomunicaciones, Biomédica e Ingeniería Industrial.\n' +
          '• **Ciencias Económicas y Administrativas:** Ciencias de la Información (Bibliotecología/Archivística), Control de Calidad, Gestión Administrativa y Finanzas.\n' +
          '• **Artes y Humanidades:** Licenciatura en Educación Artística, Artes Visuales, Artes de la Grabación y Producción Musical, e Interpretación/Traducción LSC.\n' +
          '• **Ciencias Exactas y Aplicadas:** Química Industrial y Análisis Químico.\n\n' +
          '• **Sedes Principales:** Fraternidad (Boston/Comuna 8 - muy cercana a Aranjuez), Robledo, Castilla y La Floresta.\n\n' +
          '**Nota para docentes:** Las instituciones educativas públicas de la Comuna 4 pueden solicitar convenios de articulación con la media y visitas guiadas a laboratorios y laboratorios de software para estudiantes de 10.º y 11.º.',
    links: [
      { label: 'Ver Oferta Completa de Programas ITM', url: 'https://www.itm.edu.co/programas/' },
      { label: 'Portal de Admisiones e Inscripciones ITM', url: 'https://www.itm.edu.co/admisiones/' }
    ],
    followUps: ['¿Cómo postular a Becas Sapiencia?', '¿Qué es la Articulación Media SENA?']
  },
  'sena_empleo': {
    text: 'El **SENA y la Agencia Pública de Empleo de Medellín** brindan rutas de formación técnica e inserción laboral temprana:\n\n• **Articulación con la Media:** Técnicos en Sistemas, Programación de Software y Diseño Digital desde 10.º grado.\n• **Fondo Emprender y Empleo Joven:** Acompañamiento a egresados para vinculación laboral en empresas de tecnología y servicios de la ciudad.',
    links: [
      { label: 'Oferta Académica SENA SofiaPlus', url: 'http://oferta.senasofiaplus.edu.co' },
      { label: 'Agencia Pública de Empleo SENA', url: 'https://ape.sena.edu.co' }
    ],
    followUps: ['¿Cómo postular a Becas Sapiencia?', '¿Rutas de atención contra la deserción?']
  },
  'uso_siad': {
    text: 'Para aprovechar al máximo **SIAD Aranjuez** como docente o coordinador:\n\n1. **Carga de Archivo:** Suba su plantilla en formato Excel (.xlsx) o CSV en la pestaña "Analítica / Docente".\n2. **Monitoreo:** Filtre por colegio, barrio o grado para ver los promedios y porcentajes de asistencia.\n3. **Notificación:** Utilice el botón "Notificar acudiente" para enviar un mensaje preventivo al tutor legal.\n4. **Exportación:** Descargue reportes en formato CSV para comités de evaluación.',
    links: [
      { label: 'Lineamientos de Habeas Data (Ley 1581)', url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49980' }
    ],
    followUps: ['¿Rutas de atención contra la deserción?', '¿Cómo postular a Becas Sapiencia?']
  }
};

export default function OrientaIAChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: '¡Hola! Bienvenido al **Asistente de Orientación Institucional de SIAD Aranjuez**.\n\nEstoy capacitado para orientar a docentes, coordinadores y directivos sobre rutas de atención contra la deserción, becas de Sapiencia, programas del ITM y articulación con el SENA.\n\n¿En qué tema institucional deseas asesoría hoy?',
      links: [
        { label: 'Portal Sapiencia Medellín', url: 'https://sapiencia.gov.co' },
        { label: 'Oferta Académica ITM', url: 'https://www.itm.edu.co' }
      ],
      options: [
        'Rutas de atención contra la deserción',
        'Becas Sapiencia y Matrícula Cero',
        'Carreras y articulación con el ITM',
        'Programas SENA y Empleo Joven',
        '¿Cómo usar el panel SIAD Aranjuez?'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processUserSelection = (questionText: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: questionText
    };

    let responseKey = 'uso_siad';
    const lower = questionText.toLowerCase();

    if (lower.includes('deserción') || lower.includes('ruta') || lower.includes('protocolo')) {
      responseKey = 'rutas_desercion';
    } else if (lower.includes('sapiencia') || lower.includes('beca') || lower.includes('matrícula cero') || lower.includes('matricula')) {
      responseKey = 'becas_sapiencia';
    } else if (lower.includes('itm') || lower.includes('software') || lower.includes('carrera') || lower.includes('universidad')) {
      responseKey = 'itm_software';
    } else if (lower.includes('sena') || lower.includes('empleo') || lower.includes('articulación') || lower.includes('trabajo')) {
      responseKey = 'sena_empleo';
    } else if (lower.includes('siad') || lower.includes('panel') || lower.includes('excel') || lower.includes('usar')) {
      responseKey = 'uso_siad';
    }

    const dbResponse = FAQ_DATABASE[responseKey];

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: dbResponse.text,
      links: dbResponse.links,
      options: dbResponse.followUps
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;

    const q = inputQuery.trim();
    setInputQuery('');
    processUserSelection(q);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'bot',
        text: '¡Hola! Chat reiniciado.\n\n¿En qué tema sobre la permanencia escolar o educación superior deseas consultar?',
        links: [
          { label: 'Portal Sapiencia Medellín', url: 'https://sapiencia.gov.co' },
          { label: 'Sitio Web Oficial ITM', url: 'https://www.itm.edu.co' }
        ],
        options: [
          'Rutas de atención contra la deserción',
          'Becas Sapiencia y Matrícula Cero',
          'Carreras y articulación con el ITM',
          'Programas SENA y Empleo Joven'
        ]
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Encabezado del Módulo */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-600">ORIENTACIÓN INSTITUCIONAL</span>
        <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Asistente de Orientación Docente y Vocacional
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Módulo interactivo con guías oficiales sobre convocatorias de Sapiencia, programas del ITM, rutas del SENA y protocolos de permanencia en la Comuna 4.
        </p>
      </div>

      {/* Caja de Chat */}
      <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-xl overflow-hidden flex flex-col h-[600px]">
        {/* Topbar del Chat */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base leading-none">OrientaIA SIAD</h3>
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Asistente Institucional
                </span>
              </div>
              <p className="text-xs text-primary-200 mt-0.5">Guía de Permanencia Escolar y Oferta Educativa — Comuna 4</p>
            </div>
          </div>

          <button
            onClick={resetChat}
            title="Reiniciar conversación"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo de Mensajes */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-br-none shadow-md shadow-primary-500/10'
                    : 'bg-white text-slate-800 ring-1 ring-slate-200/80 rounded-bl-none shadow-sm'
                }`}
              >
                {/* Formateo de saltos de línea y negritas */}
                <div className="whitespace-pre-wrap space-y-1">
                  {msg.text.split('\n').map((line, idx) => {
                    // Formateador simple de asteriscos para negrita
                    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return (
                      <p key={idx} dangerouslySetInnerHTML={{ __html: formattedLine }} />
                    );
                  })}
                </div>

                {/* Hipervínculos a páginas oficiales */}
                {msg.links && msg.links.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Enlaces Oficiales:</p>
                    {msg.links.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-800 hover:underline bg-primary-50/80 px-2.5 py-1.5 rounded-lg border border-primary-100/80 w-fit transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones de Opciones Sugeridas */}
              {msg.options && (
                <div className="mt-3 flex flex-wrap gap-2 max-w-[88%] sm:max-w-[80%]">
                  {msg.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => processUserSelection(opt)}
                      className="text-xs font-medium text-slate-700 bg-white hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Inferior */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Escriba su consulta (ej: Becas Sapiencia, carreras ITM, rutas de atención)..."
            className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 ring-primary-500 transition-all text-slate-800 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 disabled:hover:bg-primary-600 transition-all shadow-md shadow-primary-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        Módulo de Orientación Docente e Institucional — SIAD Comuna 4 Aranjuez
      </p>
    </div>
  );
}
