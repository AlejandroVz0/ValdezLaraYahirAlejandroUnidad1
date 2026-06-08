import React from 'react';
import { 
  Hammer, 
  Wrench, 
  Bolt, 
  Droplet, 
  Paintbrush, 
  Construction,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Truck
} from 'lucide-react';
import { Page, CATEGORIES, CategoryDetail } from '../types';

interface HomeViewProps {
  setView: (view: Page) => void;
  setSearchQuery: (query: string) => void;
  onSelectCategory: (categoryName: string) => void;
}

export default function HomeView({
  setView,
  setSearchQuery,
  onSelectCategory,
}: HomeViewProps) {

  const handleHeroCTA = () => {
    setSearchQuery('');
    setView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePromoCTA = () => {
    setSearchQuery('_OFFERS_');
    setView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getLucideIcon = (iconName: string) => {
    switch (iconName) {
      case 'hammer': return <Wrench className="h-6 w-6 text-white" />;
      case 'handyman': return <Hammer className="h-6 w-6 text-white" />;
      case 'plumbing': return <Droplet className="h-6 w-6 text-white" />;
      case 'bolt': return <Bolt className="h-6 w-6 text-white" />;
      case 'format_paint': return <Paintbrush className="h-6 w-6 text-white" />;
      case 'construction': return <Construction className="h-6 w-6 text-white" />;
      default: return <Wrench className="h-6 w-6 text-white" />;
    }
  };

  return (
    <div className="space-y-12">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[540px] flex items-center justify-center overflow-hidden bg-neutral-900 border-b border-neutral-800">
        {/* Background photo placeholder */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            alt="Interior moderno de ferretería" 
            className="w-full h-full object-cover opacity-50" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBABHkulJmC-hMS2IZJI6C7e7AJslwyZ2Pg4BROghc_s9XeTOS_mAtf-rIv7IudJoJ0A-Tqf6ZXw6BAu_-5pcluuAEcPjv6O4o22VRn_3ic6R-HFLmYDIboFpuau4CA65fAJE54tWNIPedKQbv16qvq_GFsBxiT49V8g2v65k5pwSsGkryziXA35d6_sQjQZHbxQbTCuipqlhsY5YtdYkIA7mpBOC86raRVFU64yXoHuuaQ6Sp1s3tIeWkKP91QrlcanoiiSply9Q"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-900/60 to-transparent"></div>
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
              Somos una empresa familiar comprometida con el desarrollo de Coahuila. Brindamos asesoría experta, herramientas de alto desempeño y suministro de materiales confiables para profesionales de la industria y hacedores del hogar.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button 
                onClick={handleHeroCTA}
                className="bg-amber-500 hover:bg-amber-600 text-neutral-900 px-6 py-3 rounded-md font-bold text-sm shadow-lg flex items-center gap-2 transform transition hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setView('contact')}
                className="bg-transparent border border-neutral-400 hover:border-amber-500 text-neutral-200 hover:text-amber-500 px-6 py-3 rounded-md font-bold text-sm tracking-wide transition-all cursor-pointer"
              >
                Sucursal y Contacto
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Trust Badges banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-neutral-50 dark:bg-zinc-900/20 p-6 rounded-xl border border-neutral-200/50 dark:border-neutral-800/80 transition-colors">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Garantía Directa</h4>
              <p className="text-xs text-neutral-500">Marcas originales certificadas</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Envíos Locales</h4>
              <p className="text-xs text-neutral-500">Gratis en compras mayores a $2,500</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Atención Especializada</h4>
              <p className="text-xs text-neutral-500">Canal directo por chat y WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Categories Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="text-left space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
              Nuestras Categorías
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Navega nuestro inventario organizado para asirse a tus necesidades específicas.
            </p>
          </div>
          <button 
            onClick={() => setView('categories')}
            className="text-xs sm:text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Ver detalles de categorías</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[160px]">
          
          {CATEGORIES.map((category) => {
            const isLarge = category.isLarge;

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.name)}
                className={`group relative rounded-xl overflow-hidden text-left border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-900 hover:border-amber-500 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between p-5 ${
                  isLarge ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                {/* Background overlay for styling */}
                <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Top bar with icon */}
                <div className={`p-2.5 rounded-lg w-fit transition-all duration-300 ${
                  isLarge 
                    ? 'bg-amber-500 text-neutral-900 group-hover:-translate-y-0.5' 
                    : 'bg-neutral-800 text-white group-hover:bg-amber-500 group-hover:text-neutral-900'
                }`}>
                  {getLucideIcon(category.iconName)}
                </div>

                {/* Bottom text block */}
                <div className="relative z-10 space-y-1 mt-auto">
                  <h3 className={`font-display font-extrabold text-neutral-900 dark:text-neutral-100 transition-colors group-hover:text-amber-500 ${
                    isLarge ? 'text-xl md:text-2xl' : 'text-base'
                  }`}>
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-neutral-400 font-medium leading-relaxed line-clamp-1">
                      {category.description}
                    </p>
                  )}
                  {isLarge && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-2">
                       <span>Comprar ahora</span>
                       <ArrowRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Promotion Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-orange-600 rounded-2xl p-8 sm:p-12 text-white overflow-hidden shadow-lg border border-amber-400/20">
          
          {/* Ambient circles */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -left-16 -top-16 w-48 h-48 bg-orange-400/25 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-2 max-w-xl">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white text-amber-500 uppercase tracking-wider">
                Descuentos por obra
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
                Ofertas Especiales de Temporada
              </h2>
              <p className="text-xs sm:text-sm text-neutral-900 dark:text-amber-100 font-semibold opacity-90 max-w-lg leading-relaxed">
                Ahorra como contratista. Explora podadoras, taladros Dewalt y esmeriles con hasta el 15% de descuento directo en caja. Válido en sucursal Ramos Arizpe.
              </p>
            </div>
            
            <button 
              onClick={handlePromoCTA}
              className="bg-neutral-900 hover:bg-neutral-850 text-amber-400 font-bold px-6 py-3.5 rounded-md text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              Ver Ofertas Disponibles
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
