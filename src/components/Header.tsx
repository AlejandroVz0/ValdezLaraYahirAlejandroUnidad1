import React, { useState } from 'react';
import {
  Hammer,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  X,
} from 'lucide-react';
import { CartItem, Page } from '../types';

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
  onCategoriesClick: () => void;
  onOffersClick: () => void;
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
  onCategoriesClick,
  onOffersClick,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchQuery(searchInput);
    setView('products');
    setMobileMenuOpen(false);
  };

  const handleNavClick = (view: Page) => {
    if (view === 'offers') {
      onOffersClick();
    } else if (view === 'categories') {
      onCategoriesClick();
    } else {
      if (searchQuery === '_OFFERS_') setSearchQuery('');
      setView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Inicio', view: 'home' as Page },
    { name: 'Productos', view: 'products' as Page },
    { name: 'Categorias', view: 'categories' as Page },
    { name: 'Ofertas', view: 'offers' as Page },
    { name: 'Servicios', view: 'services' as Page },
    { name: 'Nosotros', view: 'about' as Page },
    { name: 'Ayuda', view: 'help' as Page },
    { name: 'Buzon', view: 'contact' as Page },
    { name: 'Mapa', view: 'sitemap' as Page },
  ];

  return (
    <header className="bg-white dark:bg-zinc-950 text-neutral-900 dark:text-white w-full sticky top-0 z-50 shadow-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-20 gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-amber-500 hover:text-amber-400 transition-all active:scale-95 text-left"
            id="brand-logo"
          >
            <div className="bg-amber-500 text-neutral-900 p-1.5 rounded">
              <Hammer className="h-5 w-5 rotate-45" />
            </div>
            <span>Ferreteria Valdez</span>
          </button>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-xs lg:max-w-sm xl:max-w-md mx-2 lg:mx-4 relative"
          id="search-form-desktop"
        >
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            className="w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 rounded-md py-2 pl-10 pr-4 font-sans text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-neutral-400"
            placeholder="Buscar llaves, taladros, tuberia..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </form>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
          {navLinks.map((link) => {
            const isActive =
              currentView === link.view ||
              (link.view === 'offers' && searchQuery === '_OFFERS_');

            return (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.view)}
                className={`text-xs xl:text-sm font-semibold tracking-wide hover:text-amber-500 transition-colors duration-200 cursor-pointer pb-1 border-b-2 ${
                  isActive ? 'text-amber-500 border-amber-500' : 'text-neutral-600 dark:text-neutral-200 border-transparent'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          <button
            onClick={toggleDarkMode}
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all"
            title={darkMode ? 'Modo claro' : 'Modo oscuro'}
            aria-label="Cambiar tema"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="hidden md:flex items-center gap-2 border-l border-neutral-200 dark:border-neutral-700 pl-3 lg:pl-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs text-neutral-400 font-medium">Bienvenido</span>
                  <span className="text-xs font-bold text-amber-500 line-clamp-1 max-w-[100px]">{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-red-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-2.5 py-1.5 rounded transition-all"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('login')}
                  className="text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:text-amber-500 px-2.5 py-1.5 transition-all"
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

          <button
            onClick={toggleCart}
            className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:text-amber-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
            aria-label="Abrir carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-neutral-900 font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 animate-pulse">
                {cartItemsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className="md:hidden w-full border-t border-neutral-200 dark:border-neutral-800 px-4 py-3 bg-white dark:bg-zinc-950 transition-colors">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            className="w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 rounded-md py-1.5 pl-9 pr-4 font-sans text-xs focus:border-amber-500 focus:outline-none placeholder:text-neutral-400"
            placeholder="Buscar en Ferreteria Valdez..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </form>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 text-neutral-900 dark:text-white transition-colors duration-200">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.view)}
                className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                  currentView === link.view || (link.view === 'offers' && searchQuery === '_OFFERS_')
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-amber-500'
                    : 'text-neutral-700 dark:text-neutral-200'
                }`}
              >
                {link.name}
              </button>
            ))}

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
              {isLoggedIn ? (
                <div className="flex items-center justify-between px-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-400">Sesion iniciada como</span>
                    <span className="text-sm font-bold text-amber-500">{userName}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-red-400 hover:underline"
                  >
                    Cerrar sesion
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-1">
                  <button
                    onClick={() => {
                      setView('login');
                      setMobileMenuOpen(false);
                    }}
                    className="text-center font-bold text-sm text-neutral-700 dark:text-neutral-200 hover:text-amber-500 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md transition-colors"
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
