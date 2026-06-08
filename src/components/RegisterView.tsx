import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  Lock, 
  User, 
  RefreshCw, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { Page } from '../types';

interface RegisterViewProps {
  setView: (view: Page) => void;
  onRegisterSuccess: (fullName: string) => void;
}

export default function RegisterView({
  setView,
  onRegisterSuccess,
}: RegisterViewProps) {
  // Form fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  // Randomized Captcha variables
  const [captchaNum1, setCaptchaNum1] = useState(3);
  const [captchaNum2, setCaptchaNum2] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Field error validation alerts
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    captcha?: string;
  }>({});

  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 8) + 2); // 2 to 9
    setCaptchaNum2(Math.floor(Math.random() * 8) + 1); // 1 to 8
    setCaptchaInput('');
    setErrors(prev => ({ ...prev, captcha: undefined }));
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    // Basic Validations
    if (!fullName.trim()) newErrors.fullName = 'El nombre completo es obligatorio';
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Favor de ingresar un correo electrónico con formato válido';
    }
    if (!phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\d{7,15}$/.test(phone)) {
      newErrors.phone = 'El teléfono debe contener solo números (7 a 15 dígitos)';
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe contener al menos 8 caracteres';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // CAPTCHA Math check
    const correctAnswer = captchaNum1 + captchaNum2;
    if (!captchaInput.trim()) {
      newErrors.captcha = 'Favor de resolver la captcha de seguridad';
    } else if (parseInt(captchaInput) !== correctAnswer) {
      newErrors.captcha = 'Resultado de captcha incorrecto. Intenta de nuevo.';
      generateCaptcha();
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, phone, password }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setErrors({ email: result.message || 'No fue posible completar el registro' });
        generateCaptcha();
        return;
      }
      setShowSuccess(true);
      onRegisterSuccess(result.name || fullName);
    } catch {
      setErrors({ email: 'No se pudo conectar con el servidor' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden text-left transition-colors duration-200">
        
        {/* Top Header design */}
        <div className="bg-neutral-800 text-white px-6 py-5 text-center relative">
          <h2 className="font-display text-xl font-bold text-amber-500 tracking-tight">Ferretería Valdez</h2>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
            Herramientas robustas para constructores profesionales
          </p>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          {showSuccess ? (
            <div className="text-center py-6 space-y-5">
              <div className="bg-green-100 dark:bg-green-950/40 p-4 rounded-full inline-block text-green-500 animate-bounce">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-neutral-900 dark:text-neutral-100 text-xl">
                  ¡Cuenta Creada Exitosamente!
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
                  Felicidades, tu cuenta ha sido registrada con éxito en Ferretería Valdez. Ahora puedes guardar cotizaciones y cotizar directo a sucursal.
                </p>
              </div>
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => setView('home')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold py-2.5 rounded-md transition-all active:scale-95"
                >
                  Ir al Inicio / Comprar
                </button>
                <button
                  onClick={() => setView('products')}
                  className="w-full bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold py-2.5 rounded-md text-xs transition"
                >
                  Ver Catálogo Completo
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Crear Cuenta de Constructor</h3>
                <p className="text-xs text-neutral-400 mt-1">Registra tus datos y goza de descuentos especiales en mostrador.</p>
              </div>

              {/* Full Name input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-450 uppercase dark:text-neutral-400">Nombre Completo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><User className="h-4 w-4" /></span>
                  <input
                    type="text"
                    required
                    placeholder="Juan Valdez Salinas"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
                    }}
                    className={`w-full text-xs bg-neutral-50 dark:bg-zinc-950 border rounded p-2.5 pl-9 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200 ${
                      errors.fullName ? 'border-red-500 ring-1 ring-red-500/25' : 'border-neutral-205 dark:border-neutral-700'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-[10px] text-red-500 font-medium">{errors.fullName}</p>}
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-450 uppercase dark:text-neutral-400">Correo Electrónico</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><Mail className="h-4 w-4" /></span>
                  <input
                    type="email"
                    required
                    placeholder="juan.valdez@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    className={`w-full text-xs bg-neutral-50 dark:bg-zinc-950 border rounded p-2.5 pl-9 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200 ${
                      errors.email ? 'border-red-500 ring-1 ring-red-500/25' : 'border-neutral-205 dark:border-neutral-700'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email}</p>}
              </div>

              {/* Phone Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-450 uppercase dark:text-neutral-400">Número Telefónico (WhatsApp)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><Phone className="h-4 w-4" /></span>
                  <input
                    type="tel"
                    required
                    placeholder="8441234567"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                    }}
                    className={`w-full text-xs bg-neutral-50 dark:bg-zinc-950 border rounded p-2.5 pl-9 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200 ${
                      errors.phone ? 'border-red-500 ring-1 ring-red-500/25' : 'border-neutral-205 dark:border-neutral-700'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-red-500 font-medium">{errors.phone}</p>}
              </div>

              {/* Passwords grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-450 uppercase dark:text-neutral-400">Contraseña</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><Lock className="h-4 w-4" /></span>
                    <input
                      type="password"
                      required
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                      }}
                      className={`w-full text-xs bg-neutral-50 dark:bg-zinc-950 border rounded p-2.5 pl-9 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200 ${
                        errors.password ? 'border-red-500 ring-1 ring-red-500/25' : 'border-neutral-205 dark:border-neutral-700'
                      }`}
                    />
                  </div>
                  {errors.password && <p className="text-[10px] text-red-500 font-medium">{errors.password}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-450 uppercase dark:text-neutral-400">Confirmar</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><Lock className="h-4 w-4" /></span>
                    <input
                      type="password"
                      required
                      placeholder="••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                      }}
                      className={`w-full text-xs bg-neutral-50 dark:bg-zinc-950 border rounded p-2.5 pl-9 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200 ${
                        errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500/25' : 'border-neutral-205 dark:border-neutral-700'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-[10px] text-red-500 font-medium">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Randomized Math CAPTCHA block */}
              <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-850 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Control de Seguridad (CAPTCHA)
                  </span>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-1 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-amber-500"
                    title="Cargar otra captcha math"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-neutral-800 text-amber-500 font-display font-extrabold text-sm px-4 py-2.5 rounded border border-neutral-700 tracking-wider">
                    {captchaNum1} + {captchaNum2} = ?
                  </div>
                  <input
                    type="number"
                    required
                    placeholder="Resultado"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className={`flex-1 text-xs bg-white dark:bg-stone-900 border rounded p-2.5 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200 ${
                      errors.captcha ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'
                    }`}
                  />
                </div>
                {errors.captcha && <p className="text-[10px] text-red-500 font-medium">{errors.captcha}</p>}
              </div>

              {/* Submit triggers and Login switch */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold py-3 rounded-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Procesando Registro...</span>
                    </>
                  ) : (
                    <span>Registrarse y Entrar</span>
                  )}
                </button>
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 text-center">
                <span className="text-xs text-neutral-450 dark:text-neutral-400">¿Ya tienes cuenta registrada? </span>
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
                >
                  Inicia Sesión
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
