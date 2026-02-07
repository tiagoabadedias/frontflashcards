import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, MessageSquare, Zap, ArrowRight, PlayCircle, Check, Star, BrainCircuit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage3: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-indigo-50 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">E</div>
              <span className="text-xl font-bold tracking-tight text-slate-900">ExplicaAI</span>
            </div>
            <div className="flex items-center gap-8 text-sm font-medium">
              <div className="hidden md:flex gap-8">
                <a href="#features" className="text-slate-600 hover:text-indigo-600 transition-colors">Funcionalidades</a>
                <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 transition-colors">Como Funciona</a>
              </div>
              {isAuthenticated ? (
                <Link to="/dashboard" className="px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-semibold transform hover:-translate-y-0.5">
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-semibold transform hover:-translate-y-0.5">
                  Começar Grátis
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-100/50 to-purple-100/30 rounded-full blur-3xl -z-10 opacity-70"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/40 to-teal-100/30 rounded-full blur-3xl -z-10 opacity-70"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-8 animate-fade-in-up">
              <span className="flex h-2 w-2 relative mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Nova era da avaliação escolar
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1] mb-8 text-slate-900">
              Avaliação que <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">se escuta.</span>
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl mb-10 font-medium">
              Transforme a maneira como você avalia. Seus alunos explicam por áudio no WhatsApp, nossa IA analisa o raciocínio.
              <span className="block mt-2 text-indigo-600 font-semibold">Simples, humano e eficiente.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  Ir para o App <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link to="/login" className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  Começar Agora <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <button className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-full font-bold text-lg hover:border-slate-900 hover:text-slate-900 transition-all flex items-center justify-center gap-2">
                <PlayCircle className="w-5 h-5" /> Ver Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-4 text-sm font-medium text-slate-500">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p>Usado por <span className="text-slate-900 font-bold">+500 professores</span> inovadores</p>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Abstract Shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-200 to-violet-200 rounded-full opacity-30 animate-pulse-slow"></div>
            
            {/* Glassmorphism Card */}
            <div className="relative bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl shadow-indigo-500/10 rounded-[2.5rem] p-8 w-full max-w-md transform rotate-[-2deg] hover:rotate-0 transition-all duration-500">
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce-slow">
                 <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-full">
                       <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                       <p className="text-xs text-slate-500 font-semibold uppercase">Correção IA</p>
                       <p className="text-sm font-bold text-slate-900">Nota: 9.8</p>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                 <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <Mic className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-slate-900">Resposta do Aluno</h3>
                    <p className="text-slate-500 text-sm">Via WhatsApp • Há 2 min</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                          <PlayCircle className="w-4 h-4 text-slate-600" />
                       </div>
                       <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-indigo-500 rounded-full"></div>
                       </div>
                       <span className="text-xs font-bold text-slate-500">0:45</span>
                    </div>
                 </div>
                 
                 <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                    <div className="flex items-start gap-3">
                       <BrainCircuit className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                       <div>
                          <p className="text-sm font-semibold text-indigo-900 mb-1">Análise da IA</p>
                          <p className="text-sm text-slate-600 leading-relaxed">
                             "O aluno explicou corretamente o conceito, utilizando analogias criativas e vocabulário adequado."
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="bg-slate-900 py-6 overflow-hidden transform -rotate-1 origin-left scale-105 border-y-4 border-indigo-500">
        <div className="flex whitespace-nowrap animate-marquee">
          {[
            "MAIS VOZ, MAIS APRENDIZADO",
            "QUANDO O ALUNO FALA, O APRENDIZADO APARECE",
            "AVALIE ALÉM DA PROVA",
            "EDUCAÇÃO BASEADA NA EXPLICAÇÃO",
            "MAIS VOZ, MAIS APRENDIZADO",
            "QUANDO O ALUNO FALA, O APRENDIZADO APARECE",
          ].map((text, i) => (
            <span key={i} className="text-white font-black text-2xl mx-8 flex items-center tracking-wider">
              <Star className="w-6 h-6 text-indigo-400 mr-4 fill-current animate-spin-slow" />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Por que professores amam?</h2>
             <p className="text-xl text-slate-600">Reduza o tempo de correção em 80% e aumente o engajamento dos alunos em 100%.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "WhatsApp Integrado",
                desc: "Seus alunos já estão lá. Não precisa instalar nada novo.",
                color: "bg-green-500",
                lightColor: "bg-green-50",
                textColor: "text-green-600"
              },
              {
                icon: Zap,
                title: "Correção Instantânea",
                desc: "Nossa IA ouve, transcreve e corrige em segundos. Adeus pilhas de papel.",
                color: "bg-yellow-500",
                lightColor: "bg-yellow-50",
                textColor: "text-yellow-600"
              },
              {
                icon: Mic,
                title: "Avaliação Oral Real",
                desc: "Avalie a capacidade de argumentação e explicação, não apenas a memória.",
                color: "bg-indigo-500",
                lightColor: "bg-indigo-50",
                textColor: "text-indigo-600"
              }
            ].map((feature, i) => (
              <div key={i} className="group bg-white p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 ${feature.lightColor} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.textColor}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-r from-indigo-900 to-violet-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 opacity-10 rounded-full blur-3xl -ml-20 -mb-20"></div>
               
               <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                  <div>
                     <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                        "A única maneira de saber se o aluno aprendeu é pedindo para ele explicar."
                     </h2>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                        <div>
                           <p className="font-bold text-lg">Prof. Ricardo Silva</p>
                           <p className="text-indigo-200">Coordenador Pedagógico</p>
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
                        <p className="text-4xl font-bold mb-2">15k+</p>
                        <p className="text-indigo-200 text-sm">Respostas Avaliadas</p>
                     </div>
                     <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
                        <p className="text-4xl font-bold mb-2">98%</p>
                        <p className="text-indigo-200 text-sm">Precisão da IA</p>
                     </div>
                     <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center col-span-2">
                        <p className="text-4xl font-bold mb-2">80%</p>
                        <p className="text-indigo-200 text-sm">Menos tempo corrigindo</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-slate-50 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-slate-900 tracking-tight">
            Pronto para evoluir?
          </h2>
          <p className="text-slate-600 text-xl mb-12 font-medium max-w-2xl mx-auto">
            Junte-se a escolas que estão transformando a avaliação em um processo mais humano, rápido e eficiente.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
             {isAuthenticated ? (
               <Link to="/dashboard" className="px-10 py-5 bg-indigo-600 text-white rounded-full font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1">
                 Acessar meu Painel
               </Link>
             ) : (
               <Link to="/login" className="px-10 py-5 bg-indigo-600 text-white rounded-full font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1">
                 Começar Gratuitamente
               </Link>
             )}
          </div>
          <p className="mt-8 text-slate-400 font-medium text-sm">Sem cartão de crédito necessário • Cancele a qualquer momento</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-200">E</div>
              <span className="font-bold text-xl text-slate-900">ExplicaAI</span>
            </div>
            
            <div className="flex gap-8 text-slate-500 font-medium">
               <a href="#" className="hover:text-indigo-600 transition-colors">Sobre</a>
               <a href="#" className="hover:text-indigo-600 transition-colors">Privacidade</a>
               <a href="#" className="hover:text-indigo-600 transition-colors">Termos</a>
            </div>

            <div className="text-sm text-slate-400 font-medium">
              © 2026 ExplicaAI Inc.
            </div>
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-bounce-slow {
           animation: bounce 3s infinite;
        }
        .animate-pulse-slow {
           animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};
