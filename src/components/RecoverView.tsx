import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, Lock, Mail, Phone } from 'lucide-react';
import { Page } from '../types';

interface RecoverViewProps {
  setView: (view: Page) => void;
}

export default function RecoverView({ setView }: RecoverViewProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'verify' | 'reset' | 'done'>('verify');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleVerifyIdentity = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      setError('El correo electronico es obligatorio');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Formato de correo electronico invalido');
      return;
    }
    if (!/^\d{7,15}$/.test(phone)) {
      setError('Ingresa el telefono registrado de 7 a 15 digitos');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message || 'No fue posible validar la cuenta.');
        return;
      }
      setSuccessMessage(result.message || 'Datos verificados correctamente.');
      setStep('reset');
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword.length < 8) {
      setError('La nueva contrasena debe tener al menos 8 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, newPassword }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message || 'No fue posible actualizar la contrasena.');
        return;
      }
      setSuccessMessage(result.message || 'Contrasena actualizada correctamente.');
      setStep('done');
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
          <h2 className="font-display text-xl font-bold text-amber-500">Recuperar contrasena</h2>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
            Ferreteria Valdez - Ramos Arizpe
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {step === 'done' ? (
            <div className="text-center py-4 space-y-4">
              <div className="bg-green-100 dark:bg-green-950/40 p-3.5 rounded-full inline-block text-green-500">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-neutral-900 dark:text-neutral-100 text-lg">
                  Contrasena actualizada
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">{successMessage}</p>
              </div>
              <button
                onClick={() => setView('login')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold py-2.5 rounded-md text-xs sm:text-sm tracking-wide transition-all uppercase"
              >
                Volver al login
              </button>
            </div>
          ) : (
            <form onSubmit={step === 'verify' ? handleVerifyIdentity : handleResetPassword} className="space-y-5">
              <div className="text-center">
                <p className="text-xs text-neutral-500">
                  {step === 'verify'
                    ? 'Para mayor seguridad, valida tu cuenta con correo y telefono registrados.'
                    : 'Ahora escribe tu nueva contrasena.'}
                </p>
              </div>

              {successMessage && step === 'reset' && (
                <p className="text-xs text-green-600 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded p-2.5 text-center font-semibold">
                  {successMessage}
                </p>
              )}

              {error && (
                <p className="text-xs text-red-500 bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded p-2.5 text-center font-semibold">
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
                    disabled={step !== 'verify'}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (error) setError('');
                    }}
                    className={`w-full text-xs bg-neutral-50 dark:bg-zinc-950 border rounded p-2.5 pl-9 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200 ${
                      error ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'
                    } ${step !== 'verify' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Telefono registrado</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="8441234567"
                    value={phone}
                    disabled={step !== 'verify'}
                    onChange={(event) => {
                      setPhone(event.target.value.replace(/\D/g, ''));
                      if (error) setError('');
                    }}
                    className={`w-full text-xs bg-neutral-50 dark:bg-zinc-950 border rounded p-2.5 pl-9 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200 ${
                      error ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'
                    } ${step !== 'verify' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              {step === 'reset' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Nueva contrasena</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        required
                        placeholder="Minimo 8 caracteres"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className="w-full text-xs bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-700 rounded p-2.5 pl-9 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Confirmar contrasena</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        required
                        placeholder="Repite la contrasena"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="w-full text-xs bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-700 rounded p-2.5 pl-9 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold py-2.5 rounded-md text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{step === 'verify' ? 'Validando datos...' : 'Actualizando contrasena...'}</span>
                  </>
                ) : (
                  <span>{step === 'verify' ? 'Continuar' : 'Guardar nueva contrasena'}</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setView('login')}
                className="w-full flex items-center justify-center gap-1 text-xs text-neutral-500 hover:text-amber-500 font-bold py-1 bg-transparent transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Regresar al inicio de sesion</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
