import React, { useState, useEffect } from 'react';
import { Page, Product, CartItem } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WhatsAppModal from './components/WhatsAppModal';
import HomeView from './components/HomeView';
import ProductsView from './components/ProductsView';
import RegisterView from './components/RegisterView';
import RecoverView from './components/RecoverView';
import SitemapView from './components/SitemapView';
import Error404View from './components/Error404View';
import AboutView from './components/AboutView';
import ServicesView from './components/ServicesView';
import ContactView from './components/ContactView';
import LoginView from './components/LoginView';
import HelpView from './components/HelpView';
import ChatWidget from './components/ChatWidget';

// Smooth alert toast component
import { CheckCircle2, X } from 'lucide-react';

function routeToPage(): Page {
  const path = window.location.pathname.toLowerCase();
  const routes: Record<string, Page> = {
    '/': 'home',
    '/products': 'products',
    '/categories': 'categories',
    '/offers': 'offers',
    '/services': 'services',
    '/about': 'about',
    '/help': 'help',
    '/contact': 'contact',
    '/buzon': 'contact',
    '/login': 'login',
    '/register': 'register',
    '/recover': 'recover',
    '/sitemap': 'sitemap',
    '/404': 'error404',
  };
  return routes[path] || 'error404';
}

export default function App() {
  // Global states
  const [currentView, setCurrentView] = useState<Page>(routeToPage);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Cart Management
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('valdez_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);

  // WhatsApp Dialogue Management
  const [consultingProduct, setConsultingProduct] = useState<Product | null>(null);

  // Authentication Status
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('valdez_logged');
    return saved === 'true';
  });
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('valdez_user');
  });

  // Toasts notifications System
  const [toast, setToast] = useState<string | null>(null);

  // Synchronize cart arrays to memory disk
  useEffect(() => {
    localStorage.setItem('valdez_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync dark class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Add item handler
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1 }];
    });

    // Fire smooth toast alert
    setToast(`¡Añadido al carrito: ${product.name}!`);
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Auth simulators
  const handleLoginSuccess = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
    localStorage.setItem('valdez_logged', 'true');
    localStorage.setItem('valdez_user', name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName(null);
    localStorage.removeItem('valdez_logged');
    localStorage.removeItem('valdez_user');
  };

  const handleSelectCategoryFromHome = (category: string) => {
    setSelectedCategoryName(category);
    setCurrentView('products');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-900 flex flex-col font-sans transition-colors duration-300">
      
      {/* Dynamic Toast banner notification */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 flex items-center gap-3 bg-neutral-900 border border-amber-500/30 text-white px-5 py-3 rounded-lg shadow-xl animate-fade-in-down max-w-sm">
          <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
          <span className="text-xs font-semibold text-left">{toast}</span>
          <button 
            onClick={() => setToast(null)}
            className="text-neutral-400 hover:text-white shrink-0 ml-auto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentView={currentView}
        setView={setCurrentView}
        cart={cart}
        toggleCart={() => setCartOpen(!cartOpen)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        isLoggedIn={isLoggedIn}
        userName={userName}
        handleLogout={handleLogout}
      />

      {/* Primary Main Content layout router */}
      <main className="flex-1 w-full flex flex-col">
        {currentView === 'home' && (
          <HomeView
            setView={setCurrentView}
            setSearchQuery={setSearchQuery}
            onSelectCategory={handleSelectCategoryFromHome}
          />
        )}

        {currentView === 'products' && (
          <ProductsView
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddToCart={handleAddToCart}
            onConsultProduct={(product) => setConsultingProduct(product)}
            selectedCategoryName={selectedCategoryName}
            setSelectedCategoryName={setSelectedCategoryName}
          />
        )}

        {currentView === 'categories' && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
            <HomeView
              setView={setCurrentView}
              setSearchQuery={setSearchQuery}
              onSelectCategory={handleSelectCategoryFromHome}
            />
          </div>
        )}

        {currentView === 'offers' && (
          <ProductsView
            searchQuery="_OFFERS_"
            setSearchQuery={setSearchQuery}
            onAddToCart={handleAddToCart}
            onConsultProduct={(p) => setConsultingProduct(p)}
          />
        )}

        {currentView === 'services' && <ServicesView />}
        
        {currentView === 'about' && <AboutView />}

        {currentView === 'help' && <HelpView />}

        {currentView === 'contact' && <ContactView />}

        {currentView === 'login' && (
          <LoginView
            setView={setCurrentView}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentView === 'register' && (
          <RegisterView
            setView={setCurrentView}
            onRegisterSuccess={handleLoginSuccess}
          />
        )}

        {currentView === 'recover' && <RecoverView setView={setCurrentView} />}

        {currentView === 'sitemap' && (
          <SitemapView
            setView={setCurrentView}
            setSearchQuery={setSearchQuery}
          />
        )}

        {currentView === 'error404' && (
          <Error404View setView={setCurrentView} setSearchQuery={setSearchQuery} />
        )}
      </main>

      {/* Global Footer */}
      <Footer setView={setCurrentView} setSearchQuery={setSearchQuery} />

      {/* Shopping Cart Slider Drawer drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* WhatsApp Floating Overlay modal */}
      <WhatsAppModal
        product={consultingProduct}
        isOpen={consultingProduct !== null}
        onClose={() => setConsultingProduct(null)}
      />

      <ChatWidget />

    </div>
  );
}
