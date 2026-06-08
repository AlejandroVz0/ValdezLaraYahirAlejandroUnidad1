import React, { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { Product } from '../types';

interface WhatsAppModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppModal({
  product,
  isOpen,
  onClose,
}: WhatsAppModalProps) {
  const [userMsg, setUserMsg] = useState('');

  if (!isOpen || !product) return null;

  const defaultMessage = `Hola Ferretería Valdez, me interesa cotizar el producto "${product.name}" de la marca ${product.brand} (Precio: $${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN). ¿Tienen existencias disponibles para entrega inmediata en la sucursal de Ramos Arizpe?`;
  
  const currentMessage = userMsg || defaultMessage;

  const handleSendRealWhatsApp = () => {
    const encodedText = encodeURIComponent(currentMessage);
    // Real link with formatted phone number
    const whatsappUrl = `https://wa.me/528441234567?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      ></div>

      {/* Card Content container */}
      <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col z-10 transition-colors duration-200">
        
        {/* Header decoration */}
        <div className="bg-[#25D366] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 " />
            <div className="text-left">
              <h3 className="font-bold text-sm tracking-wide">Atención Ferretería Valdez</h3>
              <p className="text-[10px] text-green-100 font-medium">Asesor de Ventas en Ramos Arizpe • En Línea</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded-full transition-colors text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="p-5 space-y-4 bg-[#f0f2f5] dark:bg-neutral-950 flex-1 overflow-y-auto">
          
          {/* Virtual Assistant greeting */}
          <div className="flex items-start gap-2.5 max-w-[85%] text-left">
            <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg rounded-tl-none shadow-xs text-xs space-y-1 text-neutral-800 dark:text-neutral-200">
              <span className="font-bold text-green-600 block text-[10px] uppercase">Ferretería Valdez</span>
              <p>¡Hola! Gracias por tu interés. ¿Te gustaría cotizar o preguntar sobre las especificaciones de este artículo? Aquí te diseñamos un borrador de mensaje listo para enviar:</p>
            </div>
          </div>

          {/* Product preview card in chat */}
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-3 rounded-lg shadow-xs flex items-center gap-3 text-left">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-12 h-12 object-cover rounded bg-neutral-50"
            />
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold text-neutral-400 block">{product.brand}</span>
              <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">{product.name}</h4>
              <span className="text-xs font-bold text-amber-500">${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
            </div>
          </div>

          {/* Editable text bubble */}
          <div className="flex flex-col items-end gap-1 max-w-[90%] ml-auto text-left">
            <div className="bg-[#d9fdd3] dark:bg-green-950/40 p-3 rounded-lg rounded-tr-none shadow-xs text-xs text-neutral-800 dark:text-neutral-200 w-full border border-green-200/50 dark:border-green-900/30">
              <span className="font-bold text-green-700 dark:text-green-400 block text-[9px] uppercase mb-1">Tu Mensaje</span>
              <textarea
                value={currentMessage}
                onChange={(e) => setUserMsg(e.target.value)}
                rows={4}
                className="w-full bg-transparent border-0 p-0 text-xs text-neutral-800 dark:text-neutral-200 focus:ring-0 outline-none resize-none"
              />
            </div>
            <span className="text-[9px] text-neutral-400">Puedes editar este borrador libremente</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/50 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onClose}
            className="flex-1 text-center font-semibold text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 py-2.5 rounded border border-neutral-300 dark:border-neutral-700 transition"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSendRealWhatsApp}
            className="flex-1 bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-xs py-2.5 rounded flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Enviar por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
