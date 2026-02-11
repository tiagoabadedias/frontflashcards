import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Gradients (Same as Landing Page) */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-100/50 to-purple-100/30 rounded-full blur-3xl -z-10 opacity-70"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/40 to-teal-100/30 rounded-full blur-3xl -z-10 opacity-70"></div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 m-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-indigo-500/10 rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
            {/* Decorative top shimmer */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

            <div className="text-center mb-10">
                {/* Logo */}
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200 mb-6 transform hover:scale-105 transition-transform duration-300">
                    E
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                    Bem-vindo de volta
                </h2>
                <p className="text-slate-500 font-medium">
                    Acesse sua conta para continuar gerenciando seus flashcards e avaliações.
                </p>
            </div>
            
            <div className="space-y-6">
                <button
                    onClick={loginWithGoogle}
                    className="w-full group relative flex justify-center items-center py-4 px-4 border border-slate-200 hover:border-indigo-200 rounded-xl shadow-sm hover:shadow-md bg-white text-slate-700 font-semibold transition-all duration-200 hover:-translate-y-0.5"
                >
                    <span className="absolute left-4 flex items-center">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.23856)">
                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.769 -21.864 51.959 -21.864 51.129 C -21.864 50.299 -21.734 49.489 -21.484 48.729 L -21.484 45.639 L -25.464 45.639 C -26.284 47.269 -26.754 49.129 -26.754 51.129 C -26.754 53.129 -26.284 54.989 -25.464 56.619 L -21.484 53.529 Z"/>
                                <path fill="#EA4335" d="M -14.754 43.769 C -12.984 43.769 -11.404 44.379 -10.154 45.579 L -6.734 42.159 C -8.804 40.229 -11.514 39.019 -14.754 39.019 C -19.444 39.019 -23.494 41.719 -25.464 45.639 L -21.484 48.729 C -20.534 45.879 -17.884 43.769 -14.754 43.769 Z"/>
                            </g>
                        </svg>
                    </span>
                    Acesse com Google
                    <ArrowRight className="ml-2 w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                </button>
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-xs text-slate-400">
                    Ao entrar, você concorda com nossos <a href="#" className="text-indigo-600 hover:text-indigo-700 hover:underline">Termos de Serviço</a> e <a href="#" className="text-indigo-600 hover:text-indigo-700 hover:underline">Política de Privacidade</a>.
                </p>
            </div>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
                Não tem uma conta? <span className="text-indigo-600 font-semibold cursor-not-allowed">Cadastre-se (Em breve)</span>
            </p>
        </div>
      </div>
    </div>
  );
};
