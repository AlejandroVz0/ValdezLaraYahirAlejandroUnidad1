import React, { useEffect } from 'react';
import {
  ArrowRight,
  Bolt,
  CheckCircle,
  Construction,
  Droplet,
  Hammer,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
} from 'lucide-react';
import { CategoryDetail, CATEGORIES, Page } from '../types';

interface HomeViewProps {
  setView: (view: Page) => void;
  setSearchQuery: (query: string) => void;
  onSelectCategory: (categoryName: string) => void;
  autoScrollToCategories?: boolean;
}

export default function HomeView({
  setView,
  setSearchQuery,
  onSelectCategory,
  autoScrollToCategories = false,
}: HomeViewProps) {
  useEffect(() => {
    if (!autoScrollToCategories) return;
    const timeoutId = window.setTimeout(() => {
      document.getElementById('categorias-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [autoScrollToCategories]);

  const handleHeroCTA = () => {
    setSearchQuery('');
    setView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePromoCTA = () => {
    setSearchQuery('_OFFERS_');
    setView('offers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getLucideIcon = (iconName: string) => {
    switch (iconName) {
      case 'hammer':
        return <Wrench className="h-6 w-6 text-white" />;
      case 'handyman':
        return <Hammer className="h-6 w-6 text-white" />;
      case 'plumbing':
        return <Droplet className="h-6 w-6 text-white" />;
      case 'bolt':
        return <Bolt className="h-6 w-6 text-white" />;
      case 'format_paint':
        return <Paintbrush className="h-6 w-6 text-white" />;
      case 'construction':
        return <Construction className="h-6 w-6 text-white" />;
      default:
        return <Wrench className="h-6 w-6 text-white" />;
    }
  };

  return (
    <div className="space-y-12">
      <section className="relative w-full min-h-[540px] flex items-center justify-center overflow-hidden bg-neutral-900 border-b border-neutral-800">
        <div className="absolute inset-0 w-full h-full">
          <img
            alt="Interior de ferreteria"
            className="w-full h-full object-cover opacity-50"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBABHkulJmC-hMS2IZJI6C7e7AJslwyZ2Pg4BROghc_s9XeTOS_mAtf-rIv7IudJoJ0A-Tqf6ZXw6BAu_-5pcluuAEcPjv6O4o22VRn_3ic6R-HFLmYDIboFpuau4CA65fAJE54tWNIPedKQbv16qvq_GFsBxiT49V8g2v65k5pwSsGkryziXA35d6_sQjQZHbxQbTCuipqlhsY5YtdYkIA7mpBOC86raRVFU64yXoHuuaQ6Sp1s3tIeWkKP91QrlcanoiiSply9Q"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-900/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full text-left">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
              <span>Desde 2010 en Ramos Arizpe</span>
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
              Todo lo que necesitas para construir tus ideas
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl leading-relaxed">
              Ofrecemos herramientas, materiales y asesoria para proyectos del hogar y trabajo profesional, con atencion cercana y opciones de cotizacion.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={handleHeroCTA}
                className="bg-amber-500 hover:bg-amber-600 text-neutral-900 px-6 py-3 rounded-md font-bold text-sm shadow-lg flex items-center gap-2 transform transition hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
              >
                <span>Explorar catalogo</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('contact')}
                className="bg-transparent border border-neutral-400 hover:border-amber-500 text-neutral-200 hover:text-amber-500 px-6 py-3 rounded-md font-bold text-sm tracking-wide transition-all cursor-pointer"
              >
                Sucursal y contacto
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-neutral-50 dark:bg-zinc-900/20 p-6 rounded-xl border border-neutral-200/50 dark:border-neutral-800/80 transition-colors">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Calidad confiable</h4>
              <p className="text-xs text-neutral-500">Productos utiles para obra y hogar</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Entregas locales</h4>
              <p className="text-xs text-neutral-500">Disponibles en Ramos Arizpe y zonas cercanas</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Atencion especializada</h4>
              <p className="text-xs text-neutral-500">Soporte por contacto, chat y WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      <section id="categorias-section" className="max-w-7xl mx-auto px-4 md:px-8 space-y-6 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="text-left space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
              Nuestras categorias
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Encuentra rapido la seccion que mas se adapta a tu proyecto.
            </p>
          </div>
          <button
            onClick={() =>
              document.getElementById('categorias-section')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            }
            className="text-xs sm:text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Ver categorias</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {CATEGORIES.map((category: CategoryDetail) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.name)}
              className="group relative rounded-xl overflow-hidden text-left border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-900 hover:border-amber-500 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer flex flex-col min-h-[220px] p-5"
            >
              <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="p-2.5 rounded-lg w-fit transition-all duration-300 bg-neutral-800 text-white group-hover:bg-amber-500 group-hover:text-neutral-900">
                {getLucideIcon(category.iconName)}
              </div>

              <div className="relative z-10 space-y-2 mt-auto">
                <h3 className="font-display font-extrabold text-xl text-neutral-900 dark:text-neutral-100 transition-colors group-hover:text-amber-500">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-neutral-400 font-medium leading-relaxed line-clamp-2 min-h-[44px]">
                    {category.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest pt-1">
                  <span>Ver productos</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="relative overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-500 to-orange-500 p-8 sm:p-12 text-white shadow-lg">
          <div className="absolute -right-16 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute left-10 top-10 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
            Promociones
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-2 max-w-xl">
              <span className="inline-block rounded-md bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                Descuentos por obra
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
                Ofertas especiales de temporada
              </h2>
              <p className="text-xs sm:text-sm text-neutral-900/90 font-semibold max-w-lg leading-relaxed">
                Explora productos con descuento y compara rapido las mejores oportunidades del momento.
              </p>
            </div>

            <button
              onClick={handlePromoCTA}
              className="bg-neutral-900 text-amber-400 font-bold px-6 py-3.5 rounded-md text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:bg-neutral-800 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              Ver ofertas disponibles
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
