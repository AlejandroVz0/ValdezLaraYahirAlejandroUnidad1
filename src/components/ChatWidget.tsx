import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

type ChatMessage = { from: 'bot' | 'user'; text: string };

function replyFor(text: string) {
  const value = text.toLowerCase();
  if (value.includes('horario')) return 'Atendemos de lunes a viernes de 8:00 a.m. a 6:00 p.m. y sábados de 8:00 a.m. a 2:00 p.m.';
  if (value.includes('envío') || value.includes('envio') || value.includes('domicilio')) return 'Sí, tenemos entrega a domicilio en Ramos Arizpe y zonas cercanas.';
  if (value.includes('precio') || value.includes('cotizar') || value.includes('whatsapp')) return 'Puedes cotizar desde el botón de WhatsApp en cada producto o escribirnos por el buzón.';
  if (value.includes('factura')) return 'Sí, contamos con facturación electrónica.';
  return 'Gracias por escribir a Ferretería Valdez. Para seguimiento detallado, deja tus datos en el buzón de contacto.';
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'bot', text: 'Hola, soy el chat de ayuda. Pregúntame por horarios, envíos, precios o facturación.' }
  ]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { from: 'user', text: trimmed }, { from: 'bot', text: replyFor(trimmed) }]);
    setText('');
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {open && (
        <div className="w-[min(92vw,340px)] mb-3 bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-neutral-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Chat de ayuda</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-neutral-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={`text-xs rounded-lg px-3 py-2 ${message.from === 'user' ? 'bg-amber-500 text-neutral-900 ml-10' : 'bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 mr-8'}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="border-t border-neutral-200 dark:border-neutral-800 p-3 flex gap-2">
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Escribe tu duda..."
              className="flex-1 text-xs bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-md px-3 py-2 outline-none focus:border-amber-500"
            />
            <button type="submit" className="bg-amber-500 text-neutral-900 rounded-md px-3">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="bg-amber-500 hover:bg-amber-600 text-neutral-900 rounded-full h-14 w-14 flex items-center justify-center shadow-xl border border-amber-400"
        title="Abrir chat de ayuda"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
