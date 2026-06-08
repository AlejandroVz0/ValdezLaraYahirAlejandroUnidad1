import React from 'react';
import { Page } from '../types';
import { AlertTriangle, Home, Search, HelpCircle, ArrowLeft } from 'lucide-react';

interface Error404ViewProps {
  setView: (view: Page) => void;
  setSearchQuery: (query: string) => void;
}

export default function Error404View({ setView, setSearchQuery }: Error404ViewProps) {
  
  const handleRedirect = (view: Page) => {
    setSearchQuery('');
    setView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-6">
      
      {/* 404 Graphic badge design */}
      <div className="relative">
        <div className="bg-amber-500/10 text-amber-500 p-6 rounded-full inline-block animate-pulse">
          <AlertTriangle className="h-16 w-16" />
        </div>
        <span className="absolute -bottom-1 -right-1 bg-red-500 text-white font-extrabold text-xs px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider font-sans">
          Error 404
        </span>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
          ¡Ups! Página No Encontrada
        </h2>
        <p className="text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
          Estás intentando ingresar a una sección fuera de nuestro catálogo o que se encuentra en mantenimiento temporal de almacén. No te preocupes, puedes volver al camino correcto de inmediato.
        </p>
      </div>

      {/* Redirect choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md pt-4">
        <button
          onClick={() => handleRedirect('home')}
          className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold text-xs py-3 rounded-md transition duration-200 shadow-sm active:scale-95 cursor-pointer"
        >
          <Home className="h-4 w-4" />
          <span>Volver al Inicio</span>
        </button>

        <button
          onClick={() => handleRedirect('products')}
          className="flex items-center justify-center gap-2 border border-neutral-350 hover:border-amber-500 text-neutral-700 dark:text-neutral-300 font-bold text-xs py-3 rounded-md transition duration-200 active:scale-95 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          <Search className="h-4 w-4" />
          <span>Explorar Productos</span>
        </button>
      </div>

      {/* Back link */}
      <button
        onClick={() => handleRedirect('home')}
        className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Regresar a la página principal anterior</span>
      </button>

    </div>
  );
}
