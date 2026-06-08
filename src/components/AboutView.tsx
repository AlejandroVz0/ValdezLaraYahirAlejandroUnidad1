import React from 'react';
import { Hammer, Sparkles, ShieldCheck, Award } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 text-left space-y-10">
      
      {/* Intro section */}
      <div className="space-y-3 text-center border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Nuestra Historia desde Coahuila</span>
        </span>
        <h2 className="font-display text-4xl font-extrabold text-neutral-900 dark:text-neutral-100">
          Sobre Ferretería Valdez
        </h2>
        <p className="text-sm text-neutral-500 max-w-2xl mx-auto leading-relaxed">
          Un pilar familiar e industrial forjado con determinación, equipando el progreso de Ramos Arizpe y Saltillo.
        </p>
      </div>

      {/* Grid Content splits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
        <div className="space-y-4">
          <h3 className="font-display text-xl font-extrabold text-neutral-900 dark:text-neutral-100">
            Forjados en Esfuerzo Familiar
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Nacidos en **2010** en una pequeña bodega céntrica de Ramos Arizpe, Coahuila, Ferretería Valdez comenzó con el firme compromiso de la familia Valdez por suministrar herramientas de calidad indiscutible. Lo que comenzó como un modesto mostrador, hoy en día se ha consolidado como un centro distribuidor líder en ferretería ligera e insumos de mampostería.
          </p>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Atendemos con orgullo las demandas diarias de contratistas de naves industriales locales, maestros albañiles y apasionados de las mejoras en el hogar. La robustez y honestidad comercial son nuestras señas de identidad.
          </p>
        </div>
        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video md:aspect-square bg-neutral-150">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1bEXXjJSnsFO2slCh1HpKYqipPjVJcmPHB7wqvfQ2fdCj6jbyTbDXhTviEkw-GYdB1bKyGNwS_cYRKDO1j5qn8NcAMtX5Mx3kWv0c6MvLwf-hboC4SXzCLo4xHMAA2W0-wYPFqF2BJKJtJfEGgvD4f6cu8bz4Qjd44lzPe57d4MkS7Updr5BkOWiVNBPMDHyxqoBorUy4RVbKbA7Oglh3QuBZpFMphLIKudI3V_pZfbu0wDbJYDApG7cednPDfPp3alVUSNxJ3w" 
            alt="Trabajo industrial y herramientas Valdez" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-neutral-950/20"></div>
        </div>
      </div>

      {/* Corporate Values Bento section */}
      <div className="space-y-4 pt-4">
        <h3 className="font-display text-xl font-extrabold text-neutral-900 dark:text-neutral-100 text-center">
          Nuestros Compromisos de Marca
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2 bg-white dark:bg-zinc-900/50">
            <div className="p-2 w-fit bg-amber-500/10 text-amber-500 rounded-lg"><ShieldCheck className="h-5 w-5" /></div>
            <h4 className="font-bold text-sm text-neutral-850 dark:text-white">Autenticidad Absoluta</h4>
            <p className="text-xs text-neutral-450 leading-relaxed">Solo vendemos marcas certificadas de grado profesional directo con distribuidores oficiales.</p>
          </div>
          <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2 bg-white dark:bg-zinc-900/50">
            <div className="p-2 w-fit bg-amber-500/10 text-amber-500 rounded-lg"><Award className="h-5 w-5" /></div>
            <h4 className="font-bold text-sm text-neutral-850 dark:text-white">Asesoramiento Real</h4>
            <p className="text-xs text-neutral-450 leading-relaxed">Nuestro equipo comprende el trabajo en campo. No te vendemos más de lo que tu proyecto técnico requiere.</p>
          </div>
          <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2 bg-white dark:bg-zinc-900/50">
            <div className="p-2 w-fit bg-amber-500/10 text-amber-500 rounded-lg"><Hammer className="h-5 w-5" /></div>
            <h4 className="font-bold text-sm text-neutral-850 dark:text-white">Alianza Local</h4>
            <p className="text-xs text-neutral-450 leading-relaxed">Fomentamos empleos en Ramos Arizpe y retribuimos activamente en el crecimiento sustentable regional.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
