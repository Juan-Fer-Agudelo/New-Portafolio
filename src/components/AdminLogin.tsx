import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onBackToHome?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToHome }) => {
  const [email, setEmail] = useState('juan.colorado@talentphi.com');
  const [password, setPassword] = useState('admin123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(true);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setStatusMessage({ type: 'error', text: 'Por favor completa todos los campos.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      setStatusMessage({
        type: 'success',
        text: '¡Credenciales correctas! Redirigiendo...',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-[#fbfcfd] flex items-center justify-center p-4 sm:p-6 relative select-none font-sans overflow-hidden">
      {/* Puntos de luz / partículas ambientales sutiles como en la captura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <span className="absolute top-[5%] left-[1.5%] w-1.5 h-1.5 rounded-full bg-[#93c5fd] opacity-70"></span>
        <span className="absolute top-[14%] right-[2.5%] w-1.5 h-1.5 rounded-full bg-[#93c5fd] opacity-60"></span>
        <span className="absolute top-[50%] right-[4.5%] w-1.5 h-1.5 rounded-full bg-[#93c5fd] opacity-50"></span>
        <span className="absolute bottom-[10%] left-[25%] w-1.5 h-1.5 rounded-full bg-[#93c5fd] opacity-50"></span>
        <span className="absolute bottom-[15%] right-[1.5%] w-1.5 h-1.5 rounded-full bg-[#93c5fd] opacity-60"></span>
      </div>

      {/* Botón sutil opcional para regresar al portafolio */}
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          type="button"
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-700 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200/60 shadow-2xs transition-all cursor-pointer z-20"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al portafolio</span>
        </button>
      )}

      {/* Tarjeta de Login EXACTA a la imagen */}
      <div className="w-full max-w-[425px] bg-white rounded-[26px] shadow-[0_12px_45px_-8px_rgba(0,0,0,0.07),0_4px_16px_rgba(0,0,0,0.02)] border border-slate-100/70 p-8 sm:p-10 relative z-10 transition-all">
        
        {/* LOGO PERFECT B Aesthetic Medicine */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          <div className="flex flex-col items-start justify-center leading-none">
            <span className="text-[19px] font-semibold tracking-[0.18em] text-[#374557] font-sans">
              PERFECT
            </span>
            <span className="text-[7.5px] font-normal tracking-[0.24em] text-[#8695a7] mt-[3px] uppercase">
              Aesthetic Medicine
            </span>
          </div>

          {/* Icono 'B' estilizado en color teal turquesa */}
          <div className="flex items-center justify-center text-[#1cb7a5] ml-0.5">
            <svg
              className="w-[26px] h-[26px]"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 5C8 3.89543 8.89543 3 10 3H17.5C21.0899 3 24 5.91015 24 9.5C24 12.1868 22.3664 14.4925 20.0381 15.4578C22.9554 16.3688 25 19.0664 25 22.25C25 26.5302 21.5302 30 17.25 30H10C8.89543 30 8 29.1046 8 28V5Z"
                stroke="#1cb7a5"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 16H17C19.2091 16 21 14.2091 21 12C21 9.79086 19.2091 8 17 8H8"
                stroke="#1cb7a5"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 26H17.5C19.9853 26 22 23.9853 22 21.5C22 19.0147 19.9853 17 17.5 17H8"
                stroke="#1cb7a5"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="21" cy="7.5" r="1.5" fill="#1cb7a5" />
            </svg>
          </div>
        </div>

        {/* Título: Bienvenido */}
        <div className="text-center mb-6">
          <h1 className="text-[26px] sm:text-[28px] font-extrabold text-[#111f35] tracking-tight mb-1">
            Bienvenido
          </h1>
          <p className="text-[12.5px] text-[#6b7c93] font-normal">
            Ingresar con tus credenciales para continuar
          </p>
        </div>

        {/* Alerta de estado */}
        {statusMessage && (
          <div
            className={`mb-4 p-3 rounded-lg text-xs flex items-center gap-2 transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo Correo electrónico */}
          <div>
            <label
              htmlFor="email-input"
              className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5 text-left"
            >
              Correo electrónico
            </label>
            <div
              className={`w-full bg-[#edf4fd] rounded-[10px] border transition-all ${
                isEmailFocused
                  ? 'border-[#1cb7a5] ring-2 ring-[#1cb7a5]/20'
                  : 'border-[#d0e0f3]'
              }`}
            >
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                placeholder="juan.colorado@talentphi.com"
                required
                className="w-full px-3.5 py-2.5 bg-transparent rounded-[10px] text-[13.5px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label
              htmlFor="password-input"
              className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5 text-left"
            >
              Contraseña
            </label>
            <div
              className={`w-full bg-[#edf4fd] rounded-[10px] border relative transition-all ${
                isPasswordFocused
                  ? 'border-[#1cb7a5] ring-2 ring-[#1cb7a5]/20'
                  : 'border-[#d0e0f3]'
              }`}
            >
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="••••••••••••••••"
                required
                className="w-full px-3.5 py-2.5 pr-10 bg-transparent rounded-[10px] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none font-mono tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8ea1b4] hover:text-[#52647c] transition-colors p-1 cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Botón Ingresar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#1cb7a5] hover:bg-[#16a494] active:bg-[#128f81] text-white font-medium text-[14px] rounded-[10px] shadow-[0_6px_18px_rgba(28,183,165,0.32)] hover:shadow-[0_8px_22px_rgba(28,183,165,0.42)] transition-all duration-200 cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Ingresando...</span>
                </>
              ) : (
                <span>Ingresar</span>
              )}
            </button>
          </div>
        </form>

        {/* Texto inferior de soporte técnico */}
        <div className="mt-6 text-center">
          <p className="text-[12px] text-[#748294]">
            ¿Problemas para ingresar?{' '}
            <a
              href="mailto:soporte@perfectb.com"
              className="text-[#1e293b] hover:text-[#1cb7a5] font-semibold transition-colors hover:underline cursor-pointer"
            >
              Solicitar soporte técnico
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
