import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Play, MessageCircle, BarChart3, Check, ArrowRight, Zap, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage2: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-lime-300 selection:text-black">
      {/* Top Banner - "Fluke" style alert */}
      <div className="bg-black text-white py-2 text-center text-sm font-bold tracking-wide">
        🚀 AVALIAÇÃO DO FUTURO CHEGOU. E ELA FALA.
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-lime-400 border-2 border-black rounded-lg flex items-center justify-center text-black font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                F
              </div>
              <span className="text-2xl font-black tracking-tighter italic">FlashManager</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex space-x-8 font-bold text-sm tracking-wide">
                <a href="#funcionalidades" className="hover:text-lime-600 transition-colors">COMO FUNCIONA</a>
                <a href="#beneficios" className="hover:text-lime-600 transition-colors">BENEFÍCIOS</a>
                <a href="#depoimentos" className="hover:text-lime-600 transition-colors">QUEM USA</a>
              </div>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-6 py-2.5 border-2 border-black text-sm font-bold rounded-full text-white bg-black hover:bg-lime-400 hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  IR PRO APP
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-2.5 border-2 border-black text-sm font-bold rounded-full text-white bg-black hover:bg-lime-400 hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  ENTRAR
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-left">
              <div className="inline-block px-4 py-1.5 bg-lime-100 border border-lime-300 rounded-full text-lime-800 font-bold text-xs tracking-wider mb-8 uppercase">
                ✨ Nova era da educação
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter leading-[0.9] mb-8">
                AVALIAÇÃO<br />
                QUE SE<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-green-600 relative inline-block">
                  ESCUTA.
                  <svg className="absolute w-full h-4 -bottom-1 left-0 text-lime-400 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-gray-600 font-medium mb-10 max-w-lg leading-relaxed">
                Chega de corrigir papel até de madrugada. Seus alunos mandam áudio no WhatsApp, nossa IA corrige e você ganha vida. Simples assim.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                   <Link
                    to="/dashboard"
                    className="px-8 py-4 bg-lime-400 border-2 border-black text-black rounded-xl font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center group"
                  >
                    ACESSAR AGORA
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-lime-400 border-2 border-black text-black rounded-xl font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center group"
                  >
                    COMEÇAR GRÁTIS
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                <a href="#demo" className="px-8 py-4 bg-white border-2 border-black text-black rounded-xl font-bold text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center hover:bg-gray-50">
                  <Play className="mr-2 w-5 h-5" /> Ver Demo
                </a>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative z-10 bg-white border-4 border-black rounded-[2rem] p-6 shadow-[16px_16px_0px_0px_rgba(163,230,53,1)] transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-6 border-b-2 border-gray-100 pb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-black">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Student" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Joãozinho da 5ª B</h3>
                    <p className="text-sm text-green-600 font-bold flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Online no WhatsApp
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-2xl p-4 rounded-tl-none ml-4 max-w-[90%]">
                    <p className="text-sm font-bold text-gray-500 mb-1">Professor(a)</p>
                    <p>João, me explica o que é a fotossíntese?</p>
                  </div>
                  
                  <div className="bg-lime-100 rounded-2xl p-4 rounded-tr-none ml-auto max-w-[90%] border border-lime-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center shadow-sm">
                        <Play className="w-5 h-5 fill-black" />
                      </div>
                      <div className="flex-1">
                        <div className="h-8 bg-lime-200 rounded-full w-full flex items-center px-2">
                           <div className="w-full h-1 bg-lime-400 rounded-full"></div>
                        </div>
                        <p className="text-xs text-lime-800 font-bold mt-1 text-right">0:45 • Visto</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-4 mt-6">
                     <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-blue-600 fill-current" />
                        <span className="font-black text-blue-800 uppercase text-xs tracking-wider">Correção Automática</span>
                     </div>
                     <p className="text-sm text-blue-900 font-medium leading-relaxed">
                       "O aluno explicou corretamente que a planta usa luz solar para produzir energia. Vocabulário adequado. Nota: 10."
                     </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements behind */}
              <div className="absolute top-1/2 -right-12 w-24 h-24 bg-yellow-400 rounded-full border-4 border-black z-0"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-400 rounded-full border-4 border-black z-20 flex items-center justify-center transform -rotate-12">
                <span className="font-black text-white text-xl">WOW!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slogans Marquee - "Fluke" style */}
      <div className="bg-black py-6 overflow-hidden border-y-4 border-black">
        <div className="flex whitespace-nowrap animate-marquee">
          {[
            "MAIS VOZ, MAIS APRENDIZADO",
            "QUANDO O ALUNO FALA, O APRENDIZADO APARECE",
            "AVALIE ALÉM DA PROVA",
            "EDUCAÇÃO BASEADA NA EXPLICAÇÃO",
            "MAIS VOZ, MAIS APRENDIZADO",
            "QUANDO O ALUNO FALA, O APRENDIZADO APARECE",
          ].map((text, i) => (
            <span key={i} className="text-white font-black text-2xl mx-8 flex items-center">
              <Star className="w-6 h-6 text-lime-400 mr-4 fill-current" />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Benefits Grid */}
      <div id="beneficios" className="py-24 bg-lime-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4">POR QUE MUDAR?</h2>
            <p className="text-xl text-gray-600 font-medium">Porque prova de papel é coisa de 1900 e bolinha.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "WhatsApp é Vida",
                desc: "Seu aluno já vive lá. Use isso a seu favor. Sem apps chatos pra baixar.",
                color: "bg-green-400"
              },
              {
                icon: Mic,
                title: "Voz > Texto",
                desc: "Avalie o raciocínio, a argumentação e a explicação. Muito além do X na questão.",
                color: "bg-purple-400"
              },
              {
                icon: Zap,
                title: "IA que Corrige",
                desc: "Feedback instantâneo pra ele. Fim de semana livre pra você. Todo mundo ganha.",
                color: "bg-yellow-400"
              }
            ].map((item, index) => (
              <div 
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="bg-white border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                <div className={`w-16 h-16 ${item.color} border-4 border-black rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                  <item.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-black text-black mb-4">{item.title}</h3>
                <p className="text-gray-600 font-medium text-lg leading-relaxed">{item.desc}</p>
                
                {/* Abstract decoration */}
                <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${item.color} rounded-full opacity-20`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div id="funcionalidades" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="md:w-1/2">
              <h2 className="text-5xl font-black text-black mb-8 leading-tight">
                FÁCIL DE USAR.<br/>
                DIFÍCIL DE LARGAR.
              </h2>
              <div className="space-y-8">
                {[
                  { step: "1", title: "Crie a Campanha", desc: "Defina a pergunta e os critérios de correção." },
                  { step: "2", title: "Envie no Grupo", desc: "Mande o link no WhatsApp da turma." },
                  { step: "3", title: "Relaxe", desc: "Receba as respostas corrigidas e tabuladas." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-6 group">
                    <div className="w-12 h-12 bg-black text-lime-400 rounded-full flex items-center justify-center font-black text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-black mb-1">{item.title}</h4>
                      <p className="text-gray-600 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-black rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-[16px_16px_0px_0px_rgba(163,230,53,1)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500 rounded-full blur-[80px] opacity-20"></div>
                
                <h3 className="text-3xl font-black mb-6 relative z-10">"Avaliação que se escuta" ⭐</h3>
                
                <div className="space-y-4 relative z-10">
                   <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                     <p className="font-bold">🎯 Foco na explicação</p>
                   </div>
                   <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                     <p className="font-bold">🚀 Engajamento máximo</p>
                   </div>
                   <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                     <p className="font-bold">🤖 Tecnologia invisível</p>
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/20">
                   <p className="text-lime-400 font-bold text-lg">Junte-se a 500+ professores inovadores.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-24 bg-lime-400 border-t-4 border-black relative overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-black mb-8 tracking-tight">
            TÁ ESPERANDO O QUÊ?
          </h2>
          <p className="text-xl md:text-2xl text-black font-bold mb-12 max-w-2xl mx-auto">
            Transforme a voz dos seus alunos em dados valiosos de aprendizado hoje mesmo.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
             {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-10 py-5 bg-black text-white rounded-full font-black text-xl hover:bg-white hover:text-black hover:scale-105 transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                >
                  VOLTAR AO DASHBOARD
                </Link>
             ) : (
                <Link
                  to="/login"
                  className="px-10 py-5 bg-black text-white rounded-full font-black text-xl hover:bg-white hover:text-black hover:scale-105 transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                >
                  CRIAR CONTA GRÁTIS
                </Link>
             )}
          </div>
          <p className="mt-6 text-black font-bold text-sm uppercase tracking-widest">Zero burocracia • Cancele quando quiser</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime-400 rounded-lg flex items-center justify-center text-black font-black text-xl">
              F
            </div>
            <span className="text-2xl font-black italic">FlashManager</span>
          </div>
          <div className="flex gap-8 font-bold text-gray-400">
            <a href="#" className="hover:text-lime-400 transition-colors">Sobre</a>
            <a href="#" className="hover:text-lime-400 transition-colors">Planos</a>
            <a href="#" className="hover:text-lime-400 transition-colors">Blog</a>
            <a href="#" className="hover:text-lime-400 transition-colors">Contato</a>
          </div>
          <div className="text-gray-500 font-medium text-sm">
            © 2024 FlashManager Inc.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
