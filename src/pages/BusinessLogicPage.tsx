import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Zap, Users, BarChart3, CheckCircle } from 'lucide-react';

export const BusinessLogicPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-indigo-50 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Voltar para Início
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">E</div>
            <span className="text-lg font-bold tracking-tight text-slate-900">ExplicaAI</span>
          </div>
          <button disabled className="px-5 py-2 bg-indigo-600 text-white rounded-full opacity-50 cursor-not-allowed shadow-md font-semibold text-sm">
            Começar Agora
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Como funciona o <span className="text-indigo-600">ExplicaAI</span>?
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Uma plataforma simples que conecta professores e alunos através do WhatsApp, usando Inteligência Artificial para avaliar o aprendizado real.
            </p>
          </div>

          {/* Seção Professor */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-[100%] -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Para o Professor</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">1</div>
                <h3 className="font-bold text-lg text-slate-900">Crie sua Trilha</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Defina o tema, a pergunta ou o conceito que você quer que os alunos expliquem. Configure os critérios de avaliação.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">2</div>
                <h3 className="font-bold text-lg text-slate-900">Envie o Link/QR Code</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Compartilhe um link simples ou mostre um QR Code na sala. Os alunos entram direto pelo WhatsApp, sem logins extras.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">3</div>
                <h3 className="font-bold text-lg text-slate-900">Receba os Resultados</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Acompanhe em tempo real no Dashboard quem respondeu, as notas atribuídas pela IA e os insights sobre a turma.
                </p>
              </div>
            </div>
          </div>

          {/* Conector */}
          <div className="flex justify-center mb-12">
            <div className="h-16 w-0.5 bg-gradient-to-b from-indigo-200 to-green-200"></div>
          </div>

          {/* Seção Aluno */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-16 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-50 rounded-tr-[100%] -ml-10 -mb-10 opacity-50 pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Para o Aluno</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">1</div>
                <h3 className="font-bold text-lg text-slate-900">Receba a Pergunta</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  O aluno recebe a questão diretamente no WhatsApp, como se fosse uma mensagem de um contato.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">2</div>
                <h3 className="font-bold text-lg text-slate-900">Responda por Áudio</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Basta gravar um áudio explicando a resposta. É natural, rápido e incentiva a articulação de ideias.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">3</div>
                <h3 className="font-bold text-lg text-slate-900">Feedback Instantâneo</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Em segundos, a IA analisa a resposta e envia um feedback construtivo e uma nota preliminar.
                </p>
              </div>
            </div>
          </div>

          {/* Benefícios */}
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            <div className="bg-indigo-600 text-white p-8 rounded-3xl">
              <Zap className="w-8 h-8 mb-4 text-yellow-300" />
              <h3 className="text-xl font-bold mb-2">Agilidade</h3>
              <p className="opacity-90">Reduza o tempo de correção drasticamente. Foque em ensinar, não em corrigir pilhas de papel.</p>
            </div>
            <div className="bg-slate-900 text-white p-8 rounded-3xl">
              <BarChart3 className="w-8 h-8 mb-4 text-purple-300" />
              <h3 className="text-xl font-bold mb-2">Dados Reais</h3>
              <p className="opacity-90">Identifique rapidamente quais alunos entenderam o conceito e quais precisam de reforço.</p>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center bg-gradient-to-r from-indigo-50 to-violet-50 rounded-3xl p-12 border border-indigo-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pronto para transformar suas aulas?</h2>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
              Junte-se a centenas de professores que já estão usando o ExplicaAI.
            </p>
            <button disabled className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg opacity-50 cursor-not-allowed shadow-xl">
              Começar Agora
              <CheckCircle className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-white border-t border-slate-100 text-center text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          © 2026 ExplicaAI Inc.
        </div>
      </footer>
    </div>
  );
};
