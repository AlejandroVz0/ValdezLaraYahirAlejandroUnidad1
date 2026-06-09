import React, { useEffect, useMemo, useState } from 'react';
import {
  BadgePercent,
  ChevronRight,
  Filter,
  HelpCircle,
  MessageCircle,
  ShoppingCart,
  X,
} from 'lucide-react';
import { Product, PRODUCTS } from '../types';

interface ProductsViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddToCart: (product: Product) => void;
  onConsultProduct: (product: Product) => void;
  selectedCategoryName?: string;
  setSelectedCategoryName?: (name: string) => void;
  isLoggedIn?: boolean;
}

export default function ProductsView({
  searchQuery,
  setSearchQuery,
  onAddToCart,
  onConsultProduct,
  selectedCategoryName = '',
  setSelectedCategoryName,
  isLoggedIn = false,
}: ProductsViewProps) {
  const [categories] = useState<string[]>([
    'Herramientas Manuales',
    'Herramientas Electricas',
    'Plomeria',
    'Electricidad',
    'Construccion',
    'Pintura',
  ]);
  const [selectedCats, setSelectedCats] = useState<string[]>(
    selectedCategoryName ? [selectedCategoryName] : []
  );
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('Relevancia');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (selectedCategoryName) {
      setSelectedCats([selectedCategoryName]);
    }
  }, [selectedCategoryName]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error('No se pudieron cargar productos'))
      )
      .then((items: Product[]) => {
        if (Array.isArray(items) && items.length > 0) setProducts(items);
      })
      .catch(() => setProducts(PRODUCTS))
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleClearAllFilters = () => {
    setSelectedCats([]);
    setMinPrice('');
    setMaxPrice('');
    setOnlyInStock(false);
    setSearchQuery('');
    setSortOption('Relevancia');
    setCurrentPage(1);
    if (setSelectedCategoryName) setSelectedCategoryName('');
  };

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCats.includes(category)
      ? selectedCats.filter((value) => value !== category)
      : [...selectedCats, category];

    setSelectedCats(updated);
    if (setSelectedCategoryName) {
      setSelectedCategoryName(updated.length === 1 ? updated[0] : '');
    }
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery && searchQuery !== '_OFFERS_') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q)
      );
    }

    if (searchQuery === '_OFFERS_') {
      list = list.filter((product) => product.isOffer);
    }

    if (selectedCats.length > 0) {
      list = list.filter((product) => selectedCats.includes(product.category));
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!Number.isNaN(min)) list = list.filter((product) => product.price >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!Number.isNaN(max)) list = list.filter((product) => product.price <= max);
    }

    if (onlyInStock) {
      list = list.filter((product) => product.stock > 0);
    }

    if (sortOption === 'Precio: Menor a Mayor') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'Precio: Mayor a Menor') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'Nombre: A-Z') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, searchQuery, selectedCats, minPrice, maxPrice, onlyInStock, sortOption]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const categoryAndCount = useMemo(() => {
    return categories.map((category) => ({
      name: category,
      count: products.filter((product) => product.category === category).length,
    }));
  }, [categories, products]);

  const activeFilters = [
    selectedCats.length > 0 ? `Categorias: ${selectedCats.join(', ')}` : '',
    searchQuery && searchQuery !== '_OFFERS_' ? `Busqueda: "${searchQuery}"` : '',
    searchQuery === '_OFFERS_' ? 'Solo en oferta' : '',
    minPrice ? `Min: $${minPrice}` : '',
    maxPrice ? `Max: $${maxPrice}` : '',
    onlyInStock ? 'Solo con existencias' : '',
  ].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 transition-colors duration-200">
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-neutral-400 mb-6 bg-neutral-50 dark:bg-zinc-900/10 p-3 rounded-lg border border-neutral-200/40 dark:border-neutral-800">
        <span className="text-neutral-500">Home</span>
        <ChevronRight className="h-3 w-3 text-neutral-400" />
        <span className="text-neutral-500">Catalogo</span>
        <ChevronRight className="h-3 w-3 text-neutral-400" />
        <span className={selectedCats.length > 0 ? 'text-neutral-500' : 'text-amber-500 font-bold'}>
          Todo el inventario
        </span>
        {selectedCats.length > 0 && (
          <>
            <ChevronRight className="h-3 w-3 text-neutral-400" />
            <span className="text-amber-500 font-bold truncate">{selectedCats.join(', ')}</span>
          </>
        )}
      </div>

      {searchQuery === '_OFFERS_' && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent p-6 md:p-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500 text-neutral-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                <BadgePercent className="h-3.5 w-3.5" />
                Ofertas activas
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-neutral-900 dark:text-neutral-100">
                Promociones destacadas de Ferreteria Valdez
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl">
                Aqui reunimos los productos con mejor precio de la temporada para que sea facil comparar y cotizar rapido.
              </p>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-white/70 dark:bg-zinc-900/50 px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
              {filteredProducts.length} productos con descuento
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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

          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Buscar palabra
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Filtrar por palabra..."
                className="w-full text-xs bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded p-2 pr-8 focus:border-amber-500 outline-none text-neutral-800 dark:text-neutral-200"
                value={searchQuery === '_OFFERS_' ? '' : searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              Categorias ({categoryAndCount.length})
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
                  <span className={selectedCats.includes(cat.name) ? 'font-bold text-amber-500' : ''}>
                    {cat.name}
                  </span>
                  <span className="ml-auto text-[10px] text-neutral-400">({cat.count})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              Rango de precio ($ MXN)
            </h4>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full text-xs bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded py-1.5 pl-5 pr-2 focus:border-amber-500 outline-none text-neutral-800 dark:text-neutral-200"
                  value={minPrice}
                  onChange={(event) => {
                    setMinPrice(event.target.value);
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
                  onChange={(event) => {
                    setMaxPrice(event.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

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
              <span className={onlyInStock ? 'font-bold text-amber-500' : ''}>
                Mostrar solo en stock
              </span>
            </label>
          </div>
        </aside>

        <div className="col-span-1 lg:col-span-9 flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl shadow-xs">
            <div className="text-left font-sans">
              <p className="text-sm text-neutral-500 font-medium">
                {loadingProducts ? 'Cargando inventario...' : 'Encontramos '}
                <span className="font-extrabold text-neutral-800 dark:text-neutral-100">
                  {filteredProducts.length}
                </span>{' '}
                productos
                {searchQuery === '_OFFERS_' && (
                  <span className="text-amber-500 font-bold ml-1">en oferta especial</span>
                )}
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
                  onChange={(event) => setSortOption(event.target.value)}
                  className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded py-1 px-2.5 font-sans text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-amber-500 border-r-8 border-r-transparent font-medium"
                >
                  <option>Relevancia</option>
                  <option>Precio: Menor a Mayor</option>
                  <option>Precio: Mayor a Menor</option>
                  <option>Nombre: A-Z</option>
                </select>
              </div>

              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-1 bg-neutral-800 dark:bg-zinc-950 text-white font-bold text-xs px-3 py-1.5 rounded-md hover:bg-neutral-700 transition"
              >
                <Filter className="h-3.5 w-3.5" />
                <span>Filtros</span>
              </button>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-500 text-left">
              <p>Filtros activos: {activeFilters.join(' | ')}</p>
              <button
                onClick={handleClearAllFilters}
                className="bg-amber-500/20 dark:bg-amber-500/30 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded hover:bg-amber-500/40"
              >
                Limpiar todo
              </button>
            </div>
          )}

          {paginatedProducts.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center space-y-4 shadow-xs">
              <div className="bg-neutral-100 dark:bg-neutral-800 p-5 rounded-full inline-block text-neutral-400">
                <HelpCircle className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-neutral-800 dark:text-neutral-200 text-lg">
                  No encontramos productos
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  La combinacion de filtros o el termino de busqueda no coincide con nuestro catalogo. Intenta reiniciar los filtros.
                </p>
              </div>
              <button
                onClick={handleClearAllFilters}
                className="bg-amber-500 hover:bg-amber-600 text-neutral-900 px-5 py-2 rounded-md font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => {
                const isOutOfStock = product.stock === 0;

                return (
                  <div
                    key={product.id}
                    className={`bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden transition-all duration-300 flex flex-col group ${
                      searchQuery === '_OFFERS_'
                        ? 'border-amber-500/35 shadow-[0_0_0_1px_rgba(245,158,11,0.08)] hover:shadow-[0_10px_24px_rgba(245,158,11,0.12)]'
                        : 'border-neutral-200 dark:border-neutral-800 hover:shadow-[0px_6px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0px_6px_16px_rgba(0,0,0,0.2)]'
                    } ${isOutOfStock ? 'opacity-85' : ''}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden border-b border-neutral-100 dark:border-neutral-800 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_42%),linear-gradient(180deg,rgba(39,39,42,0.96),rgba(24,24,27,1))]">
                      {product.isOffer && (
                        <span className="absolute top-3 right-3 bg-amber-500 text-neutral-900 font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-sm tracking-widest z-10">
                          Oferta
                        </span>
                      )}

                      <div className="absolute inset-0 p-5 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-3">
                          <span className="rounded-full bg-white/80 dark:bg-zinc-950/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-200">
                            {product.category}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-300">
                            {product.brand}
                          </span>
                        </div>

                        <div className="flex-1 px-3 pt-4 pb-3 flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain drop-shadow-[0_20px_36px_rgba(0,0,0,0.45)] transition duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/35 dark:bg-black/35 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-neutral-800/90 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-md border border-neutral-700 tracking-wider">
                            Agotado
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1 text-left space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                          {product.brand}
                        </span>
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase">
                            No disponible
                          </span>
                        ) : product.stock <= 2 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase">
                            Bajo stock ({product.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase">
                            En stock
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-display font-extrabold text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2 min-h-[44px]">
                          {product.name}
                        </h4>
                        <p className="text-xs text-neutral-400 leading-relaxed font-medium line-clamp-3 min-h-[60px]">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-auto pt-2 space-y-3">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-lg font-extrabold text-neutral-900 dark:text-neutral-100">
                            ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-neutral-400 line-through">
                              ${product.originalPrice.toLocaleString('es-MX')}
                            </span>
                          )}
                          {product.originalPrice && (
                            <span className="rounded-full bg-green-100 dark:bg-green-950/40 px-2 py-1 text-[10px] font-bold text-green-700 dark:text-green-400">
                              Ahorra ${Math.round(product.originalPrice - product.price)}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {isOutOfStock ? (
                            <button
                              onClick={() => onConsultProduct(product)}
                              className="flex-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-[11px] py-2.5 rounded transition hover:bg-neutral-200 dark:hover:bg-neutral-700 flex justify-center items-center gap-1 active:scale-95 cursor-pointer"
                            >
                              <HelpCircle className="h-4 w-4" />
                              <span>Preguntar</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => onAddToCart(product)}
                                className="bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold py-2.5 px-3 rounded inline-flex items-center justify-center transition active:scale-90 cursor-pointer"
                                title={
                                  isLoggedIn
                                    ? 'Agregar al carrito'
                                    : 'Inicia sesion o registrate para usar el carrito'
                                }
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => onConsultProduct(product)}
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

          {totalPages > 1 && (
            <div className="pt-4 flex justify-center items-center gap-1.5 self-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition disabled:opacity-50"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-9 h-9 flex items-center justify-center rounded-md font-sans text-xs font-bold transition ${
                    currentPage === pageNumber
                      ? 'border border-amber-500 bg-amber-500 text-neutral-900 shadow-xs'
                      : 'border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            onClick={() => setShowMobileFilters(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />

          <div className="relative w-full max-w-xs bg-white dark:bg-zinc-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col p-5 overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className="font-display font-extrabold text-neutral-900 dark:text-white flex items-center gap-1 text-sm uppercase">
                <Filter className="h-4 w-4 text-amber-500" />
                <span>Filtros del catalogo</span>
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 text-neutral-500 hover:bg-neutral-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Categorias
                </h4>
                <div className="space-y-2">
                  {categoryAndCount.map((cat) => (
                    <label
                      key={cat.name}
                      className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer"
                    >
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

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Rango de precio
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full text-xs border border-neutral-300 dark:border-neutral-700 rounded p-1.5 focus:border-amber-500 text-neutral-800 dark:text-neutral-200 bg-neutral-50 dark:bg-zinc-950"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                  />
                  <span className="text-neutral-400 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full text-xs border border-neutral-300 dark:border-neutral-700 rounded p-1.5 focus:border-amber-500 text-neutral-800 dark:text-neutral-200 bg-neutral-50 dark:bg-zinc-950"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                  />
                </div>
              </div>

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
                className="w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-bold py-2 rounded-md text-xs"
              >
                Reiniciar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
