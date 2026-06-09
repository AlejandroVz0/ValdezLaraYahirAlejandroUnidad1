import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Facebook,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Send,
} from 'lucide-react';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [captchaNum1, setCaptchaNum1] = useState(3);
  const [captchaNum2, setCaptchaNum2] = useState(4);
  const [captchaInput, setCaptchaInput] = useState('');

  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 8) + 2);
    setCaptchaNum2(Math.floor(Math.random() * 8) + 1);
    setCaptchaInput('');
  };

  const handleMessageSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Nombre, correo y mensaje son obligatorios.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Ingresa un correo valido.');
      return;
    }
    if (phone && !/^\d{7,15}$/.test(phone)) {
      setError('El telefono debe contener solo numeros de 7 a 15 digitos.');
      return;
    }
    if (Number(captchaInput) !== captchaNum1 + captchaNum2) {
      setError('Resuelve correctamente la verificacion humana.');
      generateCaptcha();
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message || 'No fue posible enviar el mensaje.');
        return;
      }
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      generateCaptcha();
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 text-left space-y-8 transition-colors duration-200">
      <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-5 text-center sm:text-left">
        <h2 className="font-display text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center justify-center sm:justify-start gap-2">
          <MessageSquare className="h-7 w-7 text-amber-500" />
          <span>Buzon de mensajes y contacto</span>
        </h2>
        <p className="text-sm text-neutral-500 max-w-xl">
          Escribenos para cotizaciones, dudas de stock, entregas o sugerencias.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="col-span-1 md:col-span-4 space-y-6">
          <div className="bg-neutral-900 text-white p-5 rounded-xl space-y-4 shadow-sm border border-neutral-800">
            <h3 className="font-display font-extrabold text-xs text-amber-500 uppercase tracking-widest">
              Ubicacion y horarios
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex gap-2.5">
                <MapPin className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="leading-snug">
                  <span className="block font-bold text-neutral-300">Nuestra tienda</span>
                  <p>Calle Morelos #320, Zona Centro, Ramos Arizpe, Coahuila, Mexico.</p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <Clock className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="leading-snug">
                  <span className="block font-bold text-neutral-300">Horario</span>
                  <p>Lunes a viernes: 8:00 AM - 6:00 PM</p>
                  <p>Sabado: 8:00 AM - 2:00 PM</p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <Phone className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="leading-snug">
                  <span className="block font-bold text-neutral-300">Soporte directo</span>
                  <p className="text-amber-500 font-bold hover:underline">
                    <a href="tel:528441234567">+52 844 123 4567</a>
                  </p>
                  <p className="text-green-500 font-semibold mt-0.5">Disponible por WhatsApp</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3 bg-white dark:bg-zinc-900/50">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400">Canales sociales</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500 rounded flex items-center justify-center gap-1.5 transition-all text-neutral-700 dark:text-neutral-300"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                <span>Facebook</span>
              </a>
              <a
                href="https://wa.me/528441234567"
                target="_blank"
                rel="noreferrer"
                className="p-2 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500 rounded flex items-center justify-center gap-1.5 transition-all text-green-500"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="h-56 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden relative shadow-inner bg-neutral-100">
            <iframe
              title="Ubicacion Ferreteria Valdez en Ramos Arizpe"
              src="https://www.google.com/maps?q=Ramos%20Arizpe%20Centro%20Coahuila&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute left-3 top-3 bg-white/95 dark:bg-zinc-950/95 border border-neutral-200 dark:border-neutral-800 rounded-md px-3 py-2 shadow-sm text-[10px] font-bold text-neutral-800 dark:text-white">
              Mapa integrado: Ramos Arizpe Centro
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-8 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="bg-green-100 dark:bg-green-950/40 p-4 rounded-full text-green-500 inline-block">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                  Mensaje enviado correctamente
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  Gracias por ponerte en contacto. Un asesor revisara tu mensaje y te respondera pronto.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold text-xs px-5 py-2 rounded-md tracking-wider uppercase transition shadow-sm"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleMessageSubmit} className="space-y-4">
              <h3 className="font-display font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                Formulario de consulta
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase dark:text-neutral-400">Tu nombre</label>
                  <input
                    type="text"
                    required
                    placeholder="Escribe tu nombre..."
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full text-xs bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-700 rounded p-2.5 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase dark:text-neutral-400">Correo electronico</label>
                  <input
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full text-xs bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-700 rounded p-2.5 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase dark:text-neutral-400">Telefono</label>
                <input
                  type="tel"
                  placeholder="Numero de contacto..."
                  value={phone}
                  onChange={(event) => setPhone(event.target.value.replace(/\D/g, ''))}
                  className="w-full text-xs bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-700 rounded p-2.5 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase dark:text-neutral-400">Mensaje</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Escribe tu consulta, cotizacion o sugerencia..."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="w-full text-xs bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-700 rounded p-2.5 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200 resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Verificacion humana
                  </span>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-amber-500"
                    title="Cambiar verificacion"
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
                    onChange={(event) => setCaptchaInput(event.target.value)}
                    className="flex-1 text-xs bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700 rounded p-2.5 outline-none focus:border-amber-500 text-neutral-800 dark:text-neutral-200"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-amber-500 font-bold py-3.5 rounded-md text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 select-none cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Procesando envio...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Enviar mensaje</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
