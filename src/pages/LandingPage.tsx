import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Zap, MessageCircle, BarChart3, CheckCircle2, LayoutDashboard, Play, Sparkles, BrainCircuit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Navbar */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-white/70 backdrop-blur-lg border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform">
                F
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                FlashManager
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Ir para Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Entrar
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm text-blue-600 text-sm font-semibold mb-8 hover:shadow-md transition-shadow cursor-default">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                A revolução da avaliação escolar
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight mb-8 leading-[1.1]">
              Menos papel,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                mais conversa.
                <svg className="absolute w-full h-4 -bottom-2 left-0 text-blue-200 -z-10 opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
              Transforme áudios do WhatsApp em avaliações completas. 
              <span className="block mt-2 text-gray-500">
                O aluno explica falando, a IA corrige ouvindo. 🎧 ✨
              </span>
            </p>

            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 items-center">
              {isAuthenticated ? (
                 <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center group"
                >
                  Ir para o Dashboard
                  <LayoutDashboard className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center group"
                >
                  Começar Grátis
                  <Play className="ml-2 w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                </Link>
              )}
              <a href="#como-funciona" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-2xl font-bold text-lg border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center">
                Ver como funciona
              </a>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 hidden lg:block animate-float-slow">
              <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 transform -rotate-6 max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="h-2 w-24 bg-gray-100 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600">"A mitose acontece quando..."</p>
              </div>
            </div>

            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 hidden lg:block animate-float-delayed">
              <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 transform rotate-6 max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-blue-600">Nota: 9.5</p>
                </div>
                <p className="text-sm text-gray-600">"Explicação clara e correta!"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid - Bento Style */}
      <div id="como-funciona" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Mágica? Não, tecnologia. 🔮</h2>
            <p className="text-xl text-gray-600">Tudo integrado onde seus alunos já estão.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Zap Integrado</h3>
                <p className="text-gray-600 leading-relaxed">
                  Esqueça logins complicados. O aluno manda áudio no WhatsApp e pronto. Simples como mandar meme no grupo.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-100 relative overflow-hidden md:-mt-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                  <Mic className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Solta o verbo</h3>
                <p className="text-gray-600 leading-relaxed">
                  "Quem sabe, explica." Avalie a profundidade do conhecimento através da fala, captando nuances que o papel não mostra.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  <BrainCircuit className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">IA "Professora"</h3>
                <p className="text-gray-600 leading-relaxed">
                  Nossa IA ouve, transcreve e corrige com base nos seus critérios. Você revisa, aprova e ganha horas de vida.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fun Slogans Section */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { text: "🗣️ Mais voz, mais aprendizado.", color: "bg-yellow-50 border-yellow-100 text-yellow-800" },
              { text: "📝 Avalie além da prova.", color: "bg-pink-50 border-pink-100 text-pink-800" },
              { text: "💡 Educação baseada na explicação.", color: "bg-cyan-50 border-cyan-100 text-cyan-800" }
            ].map((item, index) => (
              <div key={index} className={`flex items-center justify-center p-8 rounded-3xl border-2 ${item.color} transform transition-all hover:scale-105 cursor-default`}>
                <span className="text-xl font-bold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight">
            Pronto para dar voz <br/> aos seus alunos?
          </h2>
          <p className="text-gray-300 text-xl mb-12 max-w-2xl mx-auto">
            Junte-se a professores inovadores que transformaram a avaliação em um diálogo (literalmente).
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
             {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] hover:-translate-y-1"
                >
                  Voltar ao Dashboard
                </Link>
             ) : (
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] hover:-translate-y-1"
                >
                  Criar conta grátis
                </Link>
             )}
          </div>
          <p className="mt-6 text-gray-400 text-sm">Sem cartão de crédito. Sem letras miúdas.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-3">
                F
              </div>
              <span className="text-xl font-bold text-gray-900">FlashManager</span>
            </div>
            <div className="flex gap-8 text-gray-500 font-medium">
              <a href="#" className="hover:text-gray-900 transition-colors">Sobre</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Preços</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Blog</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contato</a>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
            © 2024 FlashManager. Feito com 💜 para educação.
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float-slow {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out 3s infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(-6deg); }
          50% { transform: translateY(-20px) rotate(-6deg); }
          100% { transform: translateY(0px) rotate(-6deg); }
        }
      `}</style>
    </div>
  );
};
