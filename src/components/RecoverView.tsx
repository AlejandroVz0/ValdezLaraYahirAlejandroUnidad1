import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { Page } from '../types';

interface RecoverViewProps {
  setView: (view: Page) => void;
}

export default function RecoverView({ setView }: RecoverViewProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('El correo electrónico es obligatorio');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Formato de correo electrónico inválido');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message || 'No fue posible enviar el enlace.');
        return;
      }
      setSuccess(true);
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden text-left transition-colors">
        
        {/* Banner */}
        <div className="bg-neutral-800 text-white px-6 py-5 text-center">
          <h2 className="font-display text-xl font-bold text-amber-500">Recuperar Contraseña</h2>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Ferretería Valdez • Ramos Arizpe</p>
        </div>

        <div className="p-6 sm:p-8">
          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="bg-green-100 dark:bg-green-950/40 p-3.5 rounded-full inline-block text-green-500">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-neutral-900 dark:text-neutral-100 text-lg">Enlace Enviado</h3>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
                  Hemos enviado un enlace seguro para reestablecer tu contraseña a <span className="font-bold text-neutral-800 dark:text-neutral-200">{email}</span>. Válido por 24 horas.
                </p>
              </div>
              <button
                onClick={() => setView('login')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold py-2.5 rounded-md text-xs sm:text-sm tracking-wide transition-all uppercase"
              >
                Volver al Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center">
                <p className="text-xs text-neutral-500">
                  Ingresa tu correo registrado y te mandaremos las indicaciones de recuperación al instante.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Correo Electrónico</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className={`w-full text-xs bg-neutral-50 dark:bg-zinc-950 border rounded p-2.5 pl-9 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200 ${
                      error ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'
                    }`}
                  />
                </div>
                {error && <p className="text-[10px] text-red-500 font-semibold">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold py-2.5 rounded-md text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Enviando enlace...</span>
                  </>
                ) : (
                  <span>Enviar Enlace Seguro</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setView('login')}
                className="w-full flex items-center justify-center gap-1 text-xs text-neutral-500 hover:text-amber-500 font-bold py-1 bg-transparent transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Regresar al inicio de sesión</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
