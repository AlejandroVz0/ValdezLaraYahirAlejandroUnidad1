import React from 'react';
import { Clock, CreditCard, FileText, MessageCircle, Truck } from 'lucide-react';

const FAQS = [
  { icon: Clock, q: '¿Cuáles son los horarios de atención?', a: 'Lunes a viernes de 8:00 a.m. a 6:00 p.m. y sábados de 8:00 a.m. a 2:00 p.m.' },
  { icon: Truck, q: '¿Realizan envíos a domicilio?', a: 'Sí, ofrecemos entrega a domicilio dentro de Ramos Arizpe y zonas cercanas.' },
  { icon: CreditCard, q: '¿Aceptan pagos con tarjeta?', a: 'Aceptamos tarjetas de débito, crédito, efectivo y transferencias.' },
  { icon: MessageCircle, q: '¿Puedo hacer pedidos por WhatsApp?', a: 'Sí. Cada producto permite abrir una cotización por WhatsApp desde el catálogo.' },
  { icon: FileText, q: '¿Cuentan con facturación?', a: 'Sí, emitimos facturas electrónicas con tus datos fiscales al momento de la compra.' },
];

export default function HelpView() {
  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h2 className="font-display text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
          Ayuda y Preguntas Frecuentes
        </h2>
        <p className="text-sm text-neutral-500 mt-2">
          Respuestas rápidas para comprar, cotizar y contactar a Ferretería Valdez.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FAQS.map(({ icon: Icon, q, a }) => (
          <article key={q} className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="bg-amber-500 text-neutral-900 p-2 rounded-lg shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{q}</h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{a}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
