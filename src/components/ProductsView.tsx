import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, 
  Search, 
  Filter, 
  ShoppingCart, 
  MessageCircle, 
  CheckCircle, 
  X, 
  HelpCircle,
  AlertTriangle 
} from 'lucide-react';
import { Product, PRODUCTS } from '../types';

interface ProductsViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddToCart: (product: Product) => void;
  onConsultProduct: (product: Product) => void;
  selectedCategoryName?: string;
  setSelectedCategoryName?: (name: string) => void;
}

export default function ProductsView({
  searchQuery,
  setSearchQuery,
  onAddToCart,
  onConsultProduct,
  selectedCategoryName = '',
  setSelectedCategoryName,
}: ProductsViewProps) {
  // Local Filter States
  const [categories, setCategories] = useState<string[]>([
    'Herramientas Manuales',
    'Herramientas Eléctricas',
    'Plomería',
    'Electricidad',
    'Construcción',
    'Pintura'
  ]);
  
  // Set categories selected
  const [selectedCats, setSelectedCats] = useState<string[]>(
    selectedCategoryName ? [selectedCategoryName] : []
  );

  // Sync category selected outside (e.g. from Bento Grid click)
  React.useEffect(() => {
    if (selectedCategoryName) {
      setSelectedCats([selectedCategoryName]);
    }
  }, [selectedCategoryName]);

  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('Relevancia');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('No se pudieron cargar productos')))
      .then((items: Product[]) => {
        if (Array.isArray(items) && items.length > 0) setProducts(items);
      })
      .catch(() => setProducts(PRODUCTS))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Triggered when clear all filters clicked
  const handleClearAllFilters = () => {
    setSelectedCats([]);
    setMinPrice('');
    setMaxPrice('');
    setOnlyInStock(false);
    setSearchQuery('');
    setSortOption('Relevancia');
    if (setSelectedCategoryName) setSelectedCategoryName('');
  };

  // Check category toggle
  const handleCategoryToggle = (category: string) => {
    let updated: string[];
    if (selectedCats.includes(category)) {
      updated = selectedCats.filter(c => c !== category);
    } else {
      updated = [...selectedCats, category];
    }
    setSelectedCats(updated);
    if (setSelectedCategoryName) {
      setSelectedCategoryName(updated.length === 1 ? updated[0] : '');
    }
    setCurrentPage(1);
  };

  // Perform calculations on products list
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Check query
    if (searchQuery && searchQuery !== '_OFFERS_') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        p => p.name.toLowerCase().includes(q) || 
             p.brand.toLowerCase().includes(q) || 
             p.description.toLowerCase().includes(q)
      );
    }

    // Check special offer trigger
    if (searchQuery === '_OFFERS_') {
      list = list.filter(p => p.isOffer);
    }

    // Check categories selected
    if (selectedCats.length > 0) {
      list = list.filter(p => selectedCats.includes(p.category));
    }

    // Check price minimum
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        list = list.filter(p => p.price >= min);
      }
    }

    // Check price maximum
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        list = list.filter(p => p.price <= max);
      }
    }

    // Only in stock
    if (onlyInStock) {
      list = list.filter(p => p.stock > 0);
    }

    // Sorting block
    if (sortOption === 'Precio: Menor a Mayor') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'Precio: Mayor a Menor') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'Nombre: A-Z') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, searchQuery, selectedCats, minPrice, maxPrice, onlyInStock, sortOption]);

  // Static pagination sizing
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const categoryAndCount = useMemo(() => {
    return categories.map(cat => {
      const count = products.filter(p => p.category === cat).length;
      return { name: cat, count };
    });
  }, [categories, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 transition-colors duration-200">
      
      {/* 1. Breadcrumbs path line */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-neutral-400 mb-6 bg-neutral-50 dark:bg-zinc-900/10 p-3 rounded-lg border border-neutral-200/40 dark:border-neutral-800">
        <span className="text-neutral-500">Home</span>
        <ChevronRight className="h-3 w-3 text-neutral-400" />
        <span className="text-neutral-500">Catálogo</span>
        <ChevronRight className="h-3 w-3 text-neutral-400" />
        <span className={`${selectedCats.length > 0 ? 'text-neutral-500' : 'text-amber-500 font-bold'}`}>
          Todo el Inventario
        </span>
        {selectedCats.length > 0 && (
          <>
            <ChevronRight className="h-3 w-3 text-neutral-400" />
            <span className="text-amber-500 font-bold truncate">
              {selectedCats.join(', ')}
            </span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 2. Left side Filters panel (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-5">
            <h3 className="font-display font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-amber-500" />
              <span>Filtros</span>
            </h3>
            <button 
              onClick={handleClearAllFilters}
              className="text-[10px] uppercase font-bold text-neutral-400 hover:text-amber-500"
            >
              Reiniciar
            </button>
          </div>

          {/* Search bar helper inside filters */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Buscar Palabra
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Filtrar por palabra..."
                className="w-full text-xs bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded p-2 pr-8 focus:border-amber-500 outline-none text-neutral-800 dark:text-neutral-200"
                value={searchQuery === '_OFFERS_' ? '' : searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-11/12 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Grid */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              Categorías ({categoryAndCount.length})
            </h4>
            <div className="space-y-2">
              {categoryAndCount.map((cat) => (
                <label 
                  key={cat.name} 
                  className="flex items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(cat.name)}
                    onChange={() => handleCategoryToggle(cat.name)}
                    className="rounded border-neutral-300 dark:border-neutral-700 text-amber-500 focus:ring-amber-500 h-4.5 w-4.5"
                  />
                  <span className={`${selectedCats.includes(cat.name) ? 'font-bold text-amber-500' : ''}`}>
                    {cat.name}
                  </span>
                  <span className="ml-auto text-[10px] text-neutral-400">({cat.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Fields */}
          <div className="mb-6 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              Rango de Precio ($ MXN)
            </h4>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full text-xs bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded py-1.5 pl-5 pr-2 focus:border-amber-500 outline-none text-neutral-800 dark:text-neutral-200"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <span className="text-neutral-400 text-xs">-</span>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full text-xs bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded py-1.5 pl-5 pr-2 focus:border-amber-500 outline-none text-neutral-800 dark:text-neutral-200"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Availability onlyInStock option */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <label className="flex items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={() => {
                  setOnlyInStock(!onlyInStock);
                  setCurrentPage(1);
                }}
                className="rounded border-neutral-300 dark:border-neutral-700 text-amber-500 focus:ring-amber-500 h-4.5 w-4.5"
              />
              <span className={`${onlyInStock ? 'font-bold text-amber-500' : ''}`}>
                Mostrar solo en stock
              </span>
            </label>
          </div>
        </aside>

        {/* 3. Products Grid Area (Right Hand 9 columns) */}
        <div className="col-span-1 lg:col-span-9 flex flex-col space-y-6">
          
          {/* Toolbar: Sorting & Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl shadow-xs">
            <div className="text-left font-sans">
              <p className="text-sm text-neutral-500 font-medium">
                {loadingProducts ? 'Cargando inventario...' : 'Encontramos '}
                <span className="font-extrabold text-neutral-800 dark:text-neutral-100">{filteredProducts.length}</span> productos 
                {searchQuery === '_OFFERS_' && <span className="text-amber-500 font-bold ml-1">en oferta especial</span>}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Ordenar:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded py-1 px-2.5 font-sans text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-amber-500 border-r-8 border-r-transparent font-medium"
                >
                  <option>Relevancia</option>
                  <option>Precio: Menor a Mayor</option>
                  <option>Precio: Mayor a Menor</option>
                  <option>Nombre: A-Z</option>
                </select>
              </div>

              {/* Mobile Filter view trigger */}
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-1 bg-neutral-800 dark:bg-zinc-950 text-white font-bold text-xs px-3 py-1.5 rounded-md hover:bg-neutral-700 transition"
              >
                <Filter className="h-3.5 w-3.5" />
                <span>Filtros</span>
              </button>
            </div>
          </div>

          {/* Active Search & Filters clear notification banner */}
          {(searchQuery || selectedCats.length > 0 || minPrice || maxPrice || onlyInStock) && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-500 text-left">
              <p>
                Filtros activos: {selectedCats.length > 0 && `🏷️ Categorías: ${selectedCats.join(', ')}`}
                {searchQuery && searchQuery !== '_OFFERS_' && ` 🔍 Búsqueda: "${searchQuery}"`}
                {searchQuery === '_OFFERS_' && " 🏷️ Solo en Oferta"}
                {minPrice && ` 💵 Min: $${minPrice}`}
                {maxPrice && ` 💵 Max: $${maxPrice}`}
                {onlyInStock && " 📦 Solo con Existencias"}
              </p>
              <button 
                onClick={handleClearAllFilters}
                className="bg-amber-500/20 dark:bg-amber-500/30 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded hover:bg-amber-500/40"
              >
                Limpiar todo
              </button>
            </div>
          )}

          {/* 4. Core Products Catalog Grid */}
          {paginatedProducts.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center space-y-4 shadow-xs">
              <div className="bg-neutral-100 dark:bg-neutral-800 p-5 rounded-full inline-block text-neutral-400">
                <HelpCircle className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-neutral-800 dark:text-neutral-200 text-lg">No encontramos productos</h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  La combinación de filtros o el término de búsqueda no coinciden con ningún artículo de nuestro catálogo. Intenta reiniciar los filtros.
                </p>
              </div>
              <button 
                onClick={handleClearAllFilters}
                className="bg-amber-500 hover:bg-amber-600 text-neutral-900 px-5 py-2 rounded-md font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
              >
                Limpiar todo el filtro
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.map((p) => {
                const isOutOfStock = p.stock === 0;

                return (
                  <div 
                    key={p.id}
                    className={`bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:shadow-[0px_6px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0px_6px_16px_rgba(0,0,0,0.2)] transition-all duration-300 flex flex-col group ${
                      isOutOfStock ? 'opacity-85' : ''
                    }`}
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square overflow-hidden bg-neutral-100 p-2 border-b border-neutral-100 dark:border-neutral-800">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className={`w-full h-full object-cover rounded transition-transform duration-500 ${
                          isOutOfStock ? 'grayscale' : 'group-hover:scale-105'
                        }`}
                      />
                      
                      {/* Badge Offer */}
                      {p.isOffer && (
                        <span className="absolute top-3 left-3 bg-amber-500 text-neutral-900 font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-sm tracking-widest font-sans z-10">
                          Oferta
                        </span>
                      )}

                      {/* Out of Stock Blurred overlay container */}
                      {isOutOfStock && (
                        <div className="absolute inset-2 bg-white/20 dark:bg-black/35 backdrop-blur-[2px] flex items-center justify-center rounded">
                          <span className="bg-neutral-800/90 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-md border border-neutral-700 tracking-wider">
                            Agotado
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Meta info & content description card */}
                    <div className="p-5 flex flex-col flex-1 text-left space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                          {p.brand}
                        </span>
                        
                        {/* Stock label */}
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase">
                            No disponible
                          </span>
                        ) : p.stock <= 2 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase">
                            ⚠️ Bajo stock ({p.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase">
                            ✓ En Stock
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-display font-extrabold text-sm text-neutral-900 dark:text-neutral-100 mt-0.5 line-clamp-2 max-h-[40px]">
                          {p.name}
                        </h4>
                        <p className="text-xs text-neutral-400 leading-relaxed font-medium line-clamp-2">
                          {p.description}
                        </p>
                      </div>

                      {/* Pricing block */}
                      <div className="mt-auto pt-3 space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-extrabold text-neutral-900 dark:text-neutral-100">
                            ${p.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                          </span>
                          {p.originalPrice && (
                            <span className="text-xs text-neutral-400 line-through">
                              ${p.originalPrice.toLocaleString('es-MX')}
                            </span>
                          )}
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex gap-2">
                          {isOutOfStock ? (
                            <button
                              onClick={() => onConsultProduct(p)}
                              className="flex-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-[11px] py-2.5 rounded transition hover:bg-neutral-200 dark:hover:bg-neutral-700 flex justify-center items-center gap-1 active:scale-95 cursor-pointer"
                            >
                              <HelpCircle className="h-4 w-4" />
                              <span>Preguntar</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => onAddToCart(p)}
                                className="bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold py-2.5 px-3 rounded inline-flex items-center justify-center transition active:scale-90 cursor-pointer"
                                title="Añadir al Carrito"
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => onConsultProduct(p)}
                                className="flex-1 border border-neutral-300 dark:border-neutral-700 text-[#25D366] hover:bg-green-50 dark:hover:bg-green-950/20 font-bold text-[11px] uppercase tracking-wide py-2.5 rounded duration-300 flex justify-center items-center gap-1 active:scale-95 cursor-pointer"
                              >
                                <MessageCircle className="h-4 w-4 fill-current text-[#25D366]" />
                                <span>WhatsApp</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* 5. Pagination Bar Control */}
          {totalPages > 1 && (
            <div className="pt-4 flex justify-center items-center gap-1.5 self-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition disabled:opacity-50"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`w-9 h-9 flex items-center justify-center rounded-md font-sans text-xs font-bold transition ${
                    currentPage === n 
                      ? 'border border-amber-500 bg-amber-500 text-neutral-900 shadow-xs' 
                      : 'border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 6. Mobile Filters Drawer Model Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setShowMobileFilters(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          ></div>

          {/* Content container panel */}
          <div className="relative w-full max-w-xs bg-white dark:bg-zinc-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col p-5 overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className="font-display font-extrabold text-neutral-900 dark:text-white flex items-center gap-1 text-sm uppercase">
                <Filter className="h-4 w-4 text-amber-500" />
                <span>Filtros Catálogo</span>
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 text-neutral-500 hover:bg-neutral-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Filters list nested */}
            <div className="space-y-6 flex-1">
              {/* Category selector */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Categorías</h4>
                <div className="space-y-2">
                  {categoryAndCount.map((cat) => (
                    <label key={cat.name} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCats.includes(cat.name)}
                        onChange={() => handleCategoryToggle(cat.name)}
                        className="rounded border-neutral-300 text-amber-500"
                      />
                      <span className={selectedCats.includes(cat.name) ? 'font-bold text-amber-500' : ''}>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price select min max */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Rango de Precio</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full text-xs border border-neutral-300 rounded p-1.5 focus:border-amber-500 text-neutral-800 bg-neutral-50 dark:bg-zinc-950"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span className="text-neutral-400 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full text-xs border border-neutral-300 rounded p-1.5 focus:border-amber-500 text-neutral-800 bg-neutral-50 dark:bg-zinc-950"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* In stock toggle */}
              <div>
                <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={() => setOnlyInStock(!onlyInStock)}
                    className="rounded border-neutral-300 text-amber-500"
                  />
                  <span className={onlyInStock ? 'font-bold text-amber-500' : ''}>Solo en stock</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2 mt-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-amber-500 text-neutral-900 font-bold py-2.5 rounded-md text-xs tracking-wide"
              >
                Aplicar filtros ({filteredProducts.length})
              </button>
              <button
                onClick={() => {
                  handleClearAllFilters();
                  setShowMobileFilters(false);
                }}
                className="w-full bg-neutral-100 text-neutral-700 font-bold py-2 rounded-md text-xs"
              >
                Reiniciar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
