import React from 'react';
import { Page, SITEMAP_GROUPS } from '../types';
import { 
  Store, 
  UserCircle, 
  HelpCircle, 
  ChevronRight, 
  Map, 
  Hammer,
  HelpCircle as HelpIcon
} from 'lucide-react';

interface SitemapViewProps {
  setView: (view: Page) => void;
  setSearchQuery: (query: string) => void;
}

export default function SitemapView({ setView, setSearchQuery }: SitemapViewProps) {
  
  const handleLinkClick = (target: Page, label: string) => {
    if (label === 'Offers' || label === 'Ofertas Especiales') {
      setSearchQuery('_OFFERS_');
      setView('products');
    } else {
      setSearchQuery('');
      setView(target);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getGroupIcon = (iconName: string) => {
    switch (iconName) {
      case 'store':
        return <Store className="h-5 w-5 text-amber-500" />;
      case 'account_circle':
        return <UserCircle className="h-5 w-5 text-amber-500" />;
      case 'help':
        return <HelpCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Map className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 text-left space-y-8">
      
      {/* Intro section */}
      <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-neutral-850 text-amber-500 uppercase">
          <Map className="h-3 w-3" />
          <span>Ferretería Valdez</span>
        </span>
        <h2 className="font-display text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
          Mapa del Sitio (Sitemap)
        </h2>
        <p className="text-sm text-neutral-500 max-w-2xl leading-relaxed">
          Navega cómodamente por todas las sub-páginas, herramientas y formularios de la Ferretería Valdez. Presiona cualquiera de los enlaces para saltar directamente a cada sección.
        </p>
      </div>

      {/* Grid of groups */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SITEMAP_GROUPS.map((group) => (
          <div 
            key={group.title}
            className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:border-amber-500/50 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              {getGroupIcon(group.icon)}
              <h3 className="font-display font-extrabold text-sm text-neutral-900 dark:text-neutral-100 tracking-wide uppercase">
                {group.title === 'Main Sections' ? 'Secciones Principales' : group.title === 'User Account' ? 'Cuenta de Usuario' : 'Soporte y Ayuda'}
              </h3>
            </div>

            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleLinkClick(item.targetView, item.name)}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-amber-500 py-1.5 px-2 hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded transition-all cursor-pointer group"
                  >
                    <span>
                      {item.name === 'Home' ? 'Inicio' : 
                       item.name === 'Products' ? 'Catálogo de Herramientas' : 
                       item.name === 'Categories' ? 'Categorías Bento Grid' : 
                       item.name === 'Offers' ? 'Ofertas de Temporada' : 
                       item.name === 'Services' ? 'Servicios y FAQ' : 
                       item.name === 'About Us' ? 'Sobre Nosotros' : 
                       item.name === 'Contact' ? 'Contacto / Ubicación' : 
                       item.name === 'Login' ? 'Iniciar Sesión (Entrar)' : 
                       item.name === 'Register' ? 'Registrar Cuenta' : 
                       item.name === 'Password Recovery' ? 'Recuperar Contraseña' : 
                       item.name === 'Help Center' ? 'Centro de Ayuda' : 
                       item.name === 'FAQ' ? 'Preguntas Frecuentes' : 
                       item.name === 'Sitemap' ? 'Mapa del Sitio' : 
                       'Buzón de Mensajes'}
                    </span>
                    <ChevronRight className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Auxiliary Help Box */}
      <div className="bg-neutral-50 dark:bg-zinc-900/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="p-3 bg-amber-500/15 text-amber-500 rounded-full">
          <HelpIcon className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200">
            ¿Buscas un producto específico y no lo encuentras?
          </h4>
          <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
            Además de nuestro stock en línea de taladros, lijadoras y soldadoras, contamos con un catálogo industrial extendido directo de bodega. Escríbenos por el buzón de mensaje y cotizamos cualquier parte.
          </p>
        </div>
        <button
          onClick={() => setView('contact')}
          className="bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold text-xs px-4 py-2.5 rounded transition self-center sm:self-auto ml-auto whitespace-nowrap cursor-pointer active:scale-95"
        >
          Ir al Buzón
        </button>
      </div>

    </div>
  );
}
