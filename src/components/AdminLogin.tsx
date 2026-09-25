import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import faviconLogo from '../assets/images/favicon-32x32.png';

interface AdminLoginProps {
  onBackToHome?: () => void;
  onLoginSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToHome, onLoginSuccess }) => {
  const [email, setEmail] = useState('juanferagudelo475@gmail.com');
  const [password, setPassword] = useState('juanfernandoagu15');
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

    // Validar credenciales
    const validEmail = 'juanferagudelo475@gmail.com';
    const validPassword = 'juanfernandoagu15';

    if (email !== validEmail || password !== validPassword) {
      setStatusMessage({ type: 'error', text: 'Email o contraseña incorrectos.' });
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
      
      // Guardar en localStorage y llamar callback
      localStorage.setItem('adminLoggedIn', 'true');
      if (onLoginSuccess) {
        setTimeout(() => onLoginSuccess(), 800);
      }
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
      <div className="w-full max-w-[400px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-200 p-10 sm:p-12 relative z-10 transition-all">
        
        {/* LOGO Portafolio con Favicon */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <img 
            src={faviconLogo} 
            alt="Portafolio Logo" 
            className="w-8 h-8"
          />
          <h2 className="text-[24px] font-bold text-[#1a202c] tracking-tight">
            Portafolio
          </h2>
        </div>

        {/* Título: Bienvenido */}
        <div className="text-center mb-12">
          <h1 className="text-[32px] sm:text-[36px] font-bold text-[#1a202c] tracking-tight mb-4">
            Bienvenido
          </h1>
          <p className="text-[13.5px] text-[#6b7c93] font-normal leading-relaxed">
            Ingresar con tus credenciales para continuar
          </p>
        </div>

        {/* Alerta de estado */}
        {statusMessage && (
          <div
            className={`mb-5 p-3.5 rounded-lg text-xs flex items-center gap-2.5 transition-all ${
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
            <span className="text-[12.5px]">{statusMessage.text}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Campo Correo electrónico */}
          <div>
            <label
              htmlFor="email-input"
              className="block text-[13.5px] font-semibold text-[#1e293b] mb-4 text-center"
            >
              Correo electrónico
            </label>
            <div
              className={`w-full bg-white rounded-[14px] border-2 transition-all ${
                isEmailFocused
                  ? 'border-[#9d41e8] shadow-[0_0_0_4px_rgba(157,65,232,0.1)]'
                  : 'border-[#9d41e8] hover:border-[#9d41e8]'
              }`}
            >
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                placeholder="juanferagudelo475@gmail.com"
                required
                className="w-full px-4 py-3.5 bg-transparent rounded-[12px] text-[14.5px] text-[#1e293b] placeholder:text-[#a0aec0] focus:outline-none"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label
              htmlFor="password-input"
              className="block text-[13.5px] font-semibold text-[#1e293b] mb-4 text-center"
            >
              Contraseña
            </label>
            <div
              className={`w-full bg-white rounded-[14px] border-2 relative transition-all ${
                isPasswordFocused
                  ? 'border-[#9d41e8] shadow-[0_0_0_4px_rgba(157,65,232,0.1)]'
                  : 'border-[#9d41e8] hover:border-[#9d41e8]'
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
                className="w-full px-4 py-3.5 pr-12 bg-transparent rounded-[12px] text-[14.5px] text-[#1e293b] placeholder:text-[#a0aec0] focus:outline-none font-mono tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors p-1 cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Botón Ingresar */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-[#9d41e8] hover:bg-[#8a35d1] active:bg-[#7629b8] text-white font-semibold text-[16px] rounded-[16px] border-2 border-[#9d41e8] shadow-[0_6px_20px_rgba(157,65,232,0.3)] hover:shadow-[0_8px_28px_rgba(157,65,232,0.4)] transition-all duration-200 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
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
        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-[12px] text-[#6b7c93] leading-relaxed">
            ¿Problemas para ingresar?{' '}
            <a
              href="mailto:soporte@perfectb.com"
              className="text-[#1e293b] hover:text-[#9d41e8] font-semibold transition-colors hover:underline cursor-pointer"
            >
              Solicitar soporte técnico
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
