import React from 'react';
import { Hammer } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  setView: (view: Page) => void;
  setSearchQuery: (query: string) => void;
}

export default function Footer({ setView, setSearchQuery }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (view: Page, query?: string) => {
    if (query !== undefined) {
      setSearchQuery(query);
    } else {
      setSearchQuery('');
    }
    setView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-800 dark:bg-zinc-950 text-neutral-300 w-full mt-auto border-t border-neutral-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          <div className="col-span-1 md:col-span-5 space-y-4">
            <div className="flex items-center gap-2 font-display text-xl font-bold text-amber-500">
              <div className="bg-amber-500 text-neutral-900 p-1 rounded">
                <Hammer className="h-4 w-4 rotate-45" />
              </div>
              <span>Ferreteria Valdez</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Fundada en 2010 en Ramos Arizpe, Coahuila, somos una empresa familiar comprometida con proveer herramientas y materiales de primer nivel para proyectos grandes o pequenos.
            </p>
            <div className="text-xs text-neutral-400 font-medium">
              Calle Morelos #320, Zona Centro, Ramos Arizpe, Coahuila.
            </div>
          </div>

          <div className="col-span-1 md:col-span-4">
            <h3 className="font-semibold text-sm text-white tracking-wider uppercase mb-4">Navegacion</h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-semibold text-neutral-400">
              <li><button onClick={() => handleLinkClick('home')} className="hover:text-amber-500 transition-colors duration-200 text-left cursor-pointer">Inicio</button></li>
              <li><button onClick={() => handleLinkClick('products')} className="hover:text-amber-500 transition-colors duration-200 text-left cursor-pointer">Productos</button></li>
              <li><button onClick={() => handleLinkClick('categories')} className="hover:text-amber-500 transition-colors duration-200 text-left cursor-pointer">Categorias</button></li>
              <li><button onClick={() => handleLinkClick('products', '_OFFERS_')} className="hover:text-amber-500 transition-colors duration-200 text-left cursor-pointer">Ofertas</button></li>
              <li><button onClick={() => handleLinkClick('services')} className="hover:text-amber-500 transition-colors duration-200 text-left cursor-pointer">Servicios</button></li>
              <li><button onClick={() => handleLinkClick('about')} className="hover:text-amber-500 transition-colors duration-200 text-left cursor-pointer">Nosotros</button></li>
              <li><button onClick={() => handleLinkClick('sitemap')} className="hover:text-amber-500 transition-colors duration-200 text-left cursor-pointer">Mapa del sitio</button></li>
              <li><button onClick={() => handleLinkClick('contact')} className="hover:text-amber-500 transition-colors duration-200 text-left cursor-pointer text-amber-500 font-bold">Contacto</button></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3">
            <h3 className="font-semibold text-sm text-white tracking-wider uppercase mb-4">Redes y atencion</h3>
            <div className="flex flex-col gap-2 text-xs font-semibold text-neutral-400">
              <a
                href="https://facebook.com/ferreteria-valdez-ramos-arizpe"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-500 transition-colors flex items-center gap-1.5"
              >
                Facebook oficial
              </a>
              <a
                href="https://wa.me/528441234567?text=Hola,%20quisiera%20pedir%20informacion%20sobre%20herramientas."
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-500 transition-colors flex items-center gap-1.5 text-green-500"
              >
                WhatsApp ventas
              </a>
              <button
                onClick={() => handleLinkClick('contact')}
                className="hover:text-amber-500 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
              >
                Buzon de mensajes
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-700/60">
              <span className="block text-xs uppercase text-neutral-500 tracking-widest font-bold">Horarios</span>
              <span className="block text-xs text-neutral-400 mt-1">Lun - Vie: 8:00 AM - 6:00 PM</span>
              <span className="block text-xs text-neutral-400">Sab: 8:00 AM - 2:00 PM</span>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-neutral-500">
          <div>© {currentYear} Ferreteria Valdez. Ramos Arizpe, Coahuila, Mexico.</div>
          <div className="flex items-center gap-4 font-semibold">
            <button onClick={() => handleLinkClick('help')} className="hover:text-neutral-300">Ayuda</button>
            <span>•</span>
            <button onClick={() => handleLinkClick('contact')} className="hover:text-neutral-300">Contacto</button>
            <span>•</span>
            <button onClick={() => handleLinkClick('sitemap')} className="hover:text-amber-500 underline text-amber-500/80">Mapa del sitio</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
