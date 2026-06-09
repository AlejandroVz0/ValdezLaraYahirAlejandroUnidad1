import React, { useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'loading' | 'success'>('cart');
  const [shippingType, setShippingType] = useState<'store' | 'home'>('store');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCost = shippingType === 'home' && subtotal > 0 ? 150 : 0;
  const isFreeShipping = subtotal >= 2500;
  const finalShippingCost = isFreeShipping ? 0 : shippingCost;
  const grandTotal = subtotal + finalShippingCost;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep('loading');
    setTimeout(() => {
      setCheckoutStep('success');
    }, 2000);
  };

  const handleSuccessClose = () => {
    onClearCart();
    setCheckoutStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col transition-colors duration-200">
          <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-amber-500" />
              <span>Carrito de compras</span>
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-500 dark:text-neutral-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {checkoutStep === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-full text-neutral-400">
                      <ShoppingBag className="h-12 w-12" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-neutral-800 dark:text-neutral-200">Tu carrito esta vacio</h4>
                      <p className="text-xs text-neutral-500 max-w-[240px]">
                        Agrega productos desde el catalogo para iniciar una cotizacion o pedido.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-4 py-3 border-b border-neutral-100 dark:border-neutral-800"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-md bg-neutral-50 border border-neutral-100 dark:border-neutral-800"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                            {item.product.brand}
                          </span>
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-xs font-semibold text-amber-500 block mt-0.5">
                            ${item.product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                          </span>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                if (item.quantity < item.product.stock) {
                                  onUpdateQuantity(item.product.id, item.quantity + 1);
                                }
                              }}
                              className="p-1 border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
                              disabled={item.quantity >= item.product.stock}
                              title={item.quantity >= item.product.stock ? 'Limite de stock disponible' : ''}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-neutral-400 hover:text-red-500 rounded transition-colors self-start"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-lg space-y-3 border border-neutral-100 dark:border-neutral-800 mt-4">
                      <span className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                        Metodo de entrega
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <label
                          className={`flex flex-col p-2.5 rounded-md border text-center cursor-pointer transition-all ${
                            shippingType === 'store'
                              ? 'border-amber-500 bg-amber-500/5 text-amber-500'
                              : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name="delivery"
                            className="sr-only"
                            checked={shippingType === 'store'}
                            onChange={() => setShippingType('store')}
                          />
                          <span className="text-xs font-semibold">Recoger en tienda</span>
                          <span className="text-[10px] text-neutral-500 mt-0.5">Gratis - Ramos Arizpe</span>
                        </label>
                        <label
                          className={`flex flex-col p-2.5 rounded-md border text-center cursor-pointer transition-all ${
                            shippingType === 'home'
                              ? 'border-amber-500 bg-amber-500/5 text-amber-500'
                              : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name="delivery"
                            className="sr-only"
                            checked={shippingType === 'home'}
                            onChange={() => setShippingType('home')}
                          />
                          <span className="text-xs font-semibold">Envio a domicilio</span>
                          <span className="text-[10px] text-neutral-500 mt-0.5">
                            {isFreeShipping ? 'Gratis' : '$150.00 MXN'}
                          </span>
                        </label>
                      </div>

                      {shippingType === 'home' && (
                        <div className="mt-2 space-y-1">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Direccion de envio</label>
                          <input
                            type="text"
                            placeholder="Calle, numero, colonia, Ramos Arizpe"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            className="w-full text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded p-2 focus:border-amber-500 text-neutral-800 dark:text-neutral-200"
                          />
                          <p className="text-[9px] text-neutral-400">
                            En compras mayores a $2,500 MXN, el envio dentro de Ramos Arizpe es gratis.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {checkoutStep === 'loading' && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
                <div className="space-y-1 animate-pulse">
                  <h4 className="font-bold text-neutral-800 dark:text-neutral-200">Procesando cotizacion</h4>
                  <p className="text-xs text-neutral-500">
                    Estamos validando existencias en el almacen de Ramos Arizpe...
                  </p>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-5 px-4">
                <div className="bg-green-100 dark:bg-green-950/40 p-4 rounded-full text-green-500">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-headline font-bold text-neutral-900 dark:text-neutral-100 text-lg">
                    Orden recibida
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Registramos tu cotizacion correctamente. Un asesor de Ferreteria Valdez se pondra en contacto contigo para coordinar pago y entrega.
                  </p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 p-4 rounded-lg w-full text-left text-xs space-y-1.5 font-medium">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Folio de pedido:</span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">
                      FV-{Math.floor(Math.random() * 900000) + 100000}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Productos:</span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">{cart.length} articulos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Monto total:</span>
                    <span className="font-bold text-amber-500">
                      ${grandTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Entrega:</span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">
                      {shippingType === 'store' ? 'Recoger en tienda (Ramos Arizpe)' : 'Envio a domicilio'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSuccessClose}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold py-2.5 rounded-md transition-all active:scale-95"
                >
                  Entendido / Limpiar carrito
                </button>
              </div>
            )}
          </div>

          {checkoutStep === 'cart' && cart.length > 0 && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-5 bg-neutral-50 dark:bg-neutral-900/40 space-y-4">
              <div className="space-y-1.5 text-sm font-semibold">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                </div>
                {shippingType === 'home' && (
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Envio</span>
                    <span>
                      {isFreeShipping ? (
                        <span className="text-green-500 font-bold">Gratis</span>
                      ) : (
                        `$${shippingCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span>Total</span>
                  <span className="text-amber-500">
                    ${grandTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  disabled={shippingType === 'home' && !address.trim()}
                  className={`w-full text-center text-neutral-900 text-sm font-bold py-3 rounded-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                    shippingType === 'home' && !address.trim()
                      ? 'bg-neutral-300 dark:bg-neutral-700 opacity-50 cursor-not-allowed text-neutral-500'
                      : 'bg-amber-500 hover:bg-amber-600'
                  }`}
                >
                  <span>Iniciar pedido / cotizacion</span>
                </button>
                {shippingType === 'home' && !address.trim() && (
                  <p className="text-[10px] text-red-500 text-center font-semibold">
                    Ingresa una direccion de envio para continuar.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
