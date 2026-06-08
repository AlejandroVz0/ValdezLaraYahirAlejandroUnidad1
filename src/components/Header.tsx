import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Search, 
  User, 
  Hammer 
} from 'lucide-react';
import { Page, CartItem } from '../types';

interface HeaderProps {
  currentView: Page;
  setView: (view: Page) => void;
  cart: CartItem[];
  toggleCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isLoggedIn: boolean;
  userName: string | null;
  handleLogout: () => void;
  onCategorySelect?: (category: string) => void;
}

export default function Header({
  currentView,
  setView,
  cart,
  toggleCart,
  searchQuery,
  setSearchQuery,
  darkMode,
  toggleDarkMode,
  isLoggedIn,
  userName,
  handleLogout,
  onCategorySelect,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setView('products');
  };

  const navLinks = [
    { name: 'Inicio', view: 'home' as Page },
    { name: 'Productos', view: 'products' as Page },
    { name: 'Categorías', view: 'categories' as Page },
    { name: 'Ofertas', view: 'offers' as Page },
    { name: 'Servicios', view: 'services' as Page },
    { name: 'Nosotros', view: 'about' as Page },
    { name: 'Ayuda', view: 'help' as Page },
    { name: 'Buzón', view: 'contact' as Page },
    { name: 'Mapa', view: 'sitemap' as Page },
  ];

  return (
    <header className="bg-neutral-800 dark:bg-zinc-950 text-white w-full sticky top-0 z-50 shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-20">
        
        {/* Brand/Logo */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setView('home')} 
            className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-amber-500 hover:text-amber-400 Transition-all active:scale-95 text-left"
            id="brand-logo"
          >
            <div className="bg-amber-500 text-neutral-900 p-1.5 rounded">
              <Hammer className="h-5 w-5 rotate-45" />
            </div>
            <span>Ferretería Valdez</span>
          </button>
        </div>

        {/* Search Bar (Desktop) */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="hidden md:flex flex-1 max-w-md mx-6 relative"
          id="search-form-desktop"
        >
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            className="w-full bg-neutral-700/80 focus:bg-neutral-700 hover:bg-neutral-700/90 text-white border border-neutral-600 rounded-md py-2 pl-10 pr-4 font-sans text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-neutral-400"
            placeholder="Buscar llaves, taladros, tubería..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = currentView === link.view || 
              (link.view === 'offers' && currentView === 'products' && searchQuery === '_OFFERS_') ||
              (link.view === 'categories' && currentView === 'categories');

            return (
              <button
                key={link.name}
                onClick={() => {
                  if (link.view === 'offers') {
                    setSearchQuery('_OFFERS_');
                    setView('products');
                  } else {
                    if (searchQuery === '_OFFERS_') setSearchQuery('');
                    setView(link.view);
                  }
                }}
                className={`text-sm font-semibold tracking-wide hover:text-amber-500 transition-colors duration-200 cursor-pointer pb-1 border-b-2 ${
                  isActive 
                    ? 'text-amber-500 border-amber-500' 
                    : 'text-neutral-200 border-transparent'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Actions & Buttons */}
        <div className="flex items-center gap-4">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-neutral-300 hover:text-amber-500 hover:bg-neutral-700/50 rounded-full transition-all"
            title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* User Profile Info */}
          <div className="hidden lg:flex items-center gap-2 border-l border-neutral-700 pl-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs text-neutral-400 font-medium">Bienvenido</span>
                  <span className="text-xs font-bold text-amber-500 line-clamp-1 max-w-[100px]">{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-neutral-300 hover:text-red-400 bg-neutral-700 hover:bg-neutral-600 px-2.5 py-1.5 rounded transition-all"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('login')}
                  className="text-xs font-bold text-neutral-200 hover:text-amber-500 px-2.5 py-1.5 transition-all"
                >
                  Entrar
                </button>
                <button
                  onClick={() => setView('register')}
                  className="bg-amber-500 hover:bg-amber-600 text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-md transition-all active:scale-95"
                >
                  Registro
                </button>
              </div>
            )}
          </div>

          {/* Shopping Cart button */}
          <button
            onClick={toggleCart}
            className="relative p-2 text-neutral-300 hover:text-amber-500 rounded-full hover:bg-neutral-700/50 transition-all cursor-pointer"
            aria-label="Abrir Carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-neutral-900 font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-neutral-800 animate-pulse">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-neutral-300 hover:text-amber-500 hover:bg-neutral-700/50 rounded-full transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile search input – visible in sub-header on mobile */}
      <div className="md:hidden w-full border-t border-neutral-700 px-4 py-3 bg-neutral-800/90 dark:bg-zinc-950/90 transition-colors">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            className="w-full bg-neutral-700 text-white border border-neutral-600 rounded-md py-1.5 pl-9 pr-4 font-sans text-xs focus:border-amber-500 focus:outline-none placeholder:text-neutral-400"
            placeholder="Buscar en Ferretería Valdez..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
      </div>

      {/* Mobile Sidebar Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-neutral-700 bg-neutral-800 dark:bg-zinc-950 text-white transition-colors duration-200">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  if (link.view === 'offers') {
                    setSearchQuery('_OFFERS_');
                    setView('products');
                  } else {
                    if (searchQuery === '_OFFERS_') setSearchQuery('');
                    setView(link.view);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-semibold hover:bg-neutral-700 transition-colors ${
                  currentView === link.view ? 'bg-neutral-700 text-amber-500' : 'text-neutral-200'
                }`}
              >
                {link.name}
              </button>
            ))}

            {/* Mobile Account actions */}
            <div className="pt-4 border-t border-neutral-700 space-y-3">
              {isLoggedIn ? (
                <div className="flex items-center justify-between px-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-400">Sesión iniciada como</span>
                    <span className="text-sm font-bold text-amber-500">{userName}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-red-400 hover:underline"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-1">
                  <button
                    onClick={() => {
                      setView('login');
                      setMobileMenuOpen(false);
                    }}
                    className="text-center font-bold text-sm text-neutral-200 hover:text-amber-500 py-2 border border-neutral-600 rounded-md transition-colors"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => {
                      setView('register');
                      setMobileMenuOpen(false);
                    }}
                    className="text-center font-bold text-sm bg-amber-500 hover:bg-amber-600 text-neutral-900 py-2 rounded-md transition-all"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
