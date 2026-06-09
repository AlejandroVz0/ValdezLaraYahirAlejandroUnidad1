import React, { useState } from 'react';
import { Loader2, Lock, Mail } from 'lucide-react';
import { Page } from '../types';

interface LoginViewProps {
  setView: (view: Page) => void;
  onLoginSuccess: (fullName: string) => void;
}

export default function LoginView({ setView, onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message || 'Credenciales invalidas');
        return;
      }
      onLoginSuccess(result.name || 'Usuario');
      setView('home');
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden text-left transition-colors">
        <div className="bg-neutral-800 text-white px-6 py-5 text-center">
          <h2 className="font-display text-xl font-bold text-amber-500">Iniciar sesion</h2>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
            Ferreteria Valdez - Ramos Arizpe
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <p className="text-xs text-neutral-500">
                Ingresa a tu cuenta para consultar pedidos y cotizaciones anteriores.
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-100 p-2.5 rounded font-semibold text-center border border-red-200">
                {error}
              </p>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase">Correo electronico</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full text-xs bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-700 p-2.5 pl-9 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200 rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Contrasena</label>
                <button
                  type="button"
                  onClick={() => setView('recover')}
                  className="text-[10px] font-bold text-amber-500 hover:underline hover:text-amber-600"
                >
                  La olvidaste?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="********"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full text-xs bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-700 p-2.5 pl-9 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200 rounded"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold py-2.5 rounded transition shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide disabled:opacity-50 select-none cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <span>Iniciar sesion</span>
              )}
            </button>

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 text-center">
              <span className="text-xs text-neutral-500">No tienes cuenta? </span>
              <button
                type="button"
                onClick={() => setView('register')}
                className="text-xs font-bold text-amber-500 hover:underline block mx-auto mt-1"
              >
                Registrate aqui
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
