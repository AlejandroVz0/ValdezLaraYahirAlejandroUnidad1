import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Clock, ShieldAlert } from 'lucide-react';
import { FAQS } from '../types';

export default function ServicesView() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 text-left space-y-10">
      
      {/* Page Title */}
      <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-5 text-center sm:text-left">
        <h2 className="font-display text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center justify-center sm:justify-start gap-2">
          <HelpCircle className="h-7 w-7 text-amber-500" />
          <span>Servicios y Preguntas Frecuentes</span>
        </h2>
        <p className="text-sm text-neutral-500 max-w-xl">
          ¿Tienes dudas sobre facturación, coberturas de fletes, o garantías? Encuentra respuestas inmediatas a continuación.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Accordion FAQ Grid */}
        <div className="col-span-1 md:col-span-8 space-y-4">
          <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-neutral-100 mb-2">
            Preguntas Frecuentes (FAQ)
          </h3>
          
          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div 
                  key={faq.question}
                  className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleIndex(index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left font-sans font-bold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 hover:bg-neutral-55 dark:hover:bg-neutral-850 transition duration-200"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-amber-500 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800 animate-slideDown">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Aside detail bar */}
        <div className="col-span-1 md:col-span-4 space-y-6">
          
          {/* Services Box */}
          <div className="bg-neutral-800 text-white p-5 rounded-xl space-y-4 shadow-md">
            <h4 className="font-display font-extrabold text-sm text-amber-400 uppercase tracking-widest">
              Apoyo a Contratistas
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              ¿Administras obras hidráulicas o de edificación en Ramos Arizpe? Ofrecemos líneas de cotización exprés, entrega a pie de obra y descuentos por mayoreo en compras directas.
            </p>
            <div className="p-3 bg-neutral-700/50 rounded-lg flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-500 shrink-0" />
              <div className="text-left leading-normal">
                <span className="block text-[10px] font-bold text-neutral-400 uppercase">Respuesta Rápida</span>
                <span className="text-xs font-bold">Menos de 15 minutos</span>
              </div>
            </div>
          </div>

          {/* Warranty Box */}
          <div className="p-5 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl space-y-2">
            <div className="p-2 w-fit bg-red-500/10 text-red-500 rounded"><ShieldAlert className="h-4 w-4" /></div>
            <h4 className="font-bold text-xs text-neutral-850 dark:text-white uppercase tracking-wider">Centro Técnico Oficial</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              No dejes tus repuestos en manos inexpertas. Si un taladro de Dewalt falla en campo, te enlazamos con talleres autorizados oficiales bajo el amparo de la marca Valdez.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
