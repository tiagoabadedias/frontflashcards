import { useParams, Link } from 'react-router-dom';
import { QrCode, Target, ExternalLink, Check } from 'lucide-react';
import { useCampaign } from '../hooks/useCampaigns';

export const CampaignQRCodePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, isLoading } = useCampaign(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <QrCode className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Campanha não encontrada</h2>
          <p className="text-slate-600 mb-8">A campanha que você está procurando não existe ou foi removida.</p>
          <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors">
            Voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  const text = `Quero me inscrever na campanha ${campaign.name} ${campaign._id}`;
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=555121654734&text=${encodedText}`;
  const qrCodeUrl = `https://api-qrcode-three.vercel.app/qrcode?text=${encodeURIComponent(whatsappUrl)}`;

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-100/50 to-purple-100/30 rounded-full blur-3xl -z-10 opacity-70"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/40 to-teal-100/30 rounded-full blur-3xl -z-10 opacity-70"></div>

      {/* Navbar Minimalista */}
      <nav className="absolute top-0 left-0 w-full p-6 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">E</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ExplicaAI</span>
          </Link>
        </div>
      </nav>

      <div className="min-h-screen flex items-center justify-center p-4 pt-24">
        <div className="max-w-4xl w-full grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          
          {/* Coluna da Esquerda - Informações */}
          <div className="lg:col-span-3 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-6">
              <Target className="w-3 h-3 mr-2" />
              Convite para Campanha
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Participe da campanha <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                {campaign.name}
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {campaign.description || "Participe desta campanha para testar seus conhecimentos e receber feedback instantâneo."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleWhatsAppClick}
                className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 hover:-translate-y-1"
              >
                <ExternalLink className="w-5 h-5" />
                Entrar via WhatsApp
              </button>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="bg-green-100 p-2 rounded-full mt-1">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Quiz Interativo</h3>
                  <p className="text-sm text-slate-500 mt-1">Receba perguntas e responda diretamente pelo WhatsApp.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="bg-indigo-100 p-2 rounded-full mt-1">
                  <Check className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Feedback Inteligente</h3>
                  <p className="text-sm text-slate-500 mt-1">Nossa IA analisa suas respostas e ajuda você a melhorar.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna da Direita - QR Code Card */}
          <div className="lg:col-span-2 order-1 lg:order-2 flex justify-center">
            <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 border border-slate-100 max-w-sm w-full transform hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <QrCode className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Scan me</p>
                    <p className="text-sm font-bold text-slate-900">Acesso Rápido</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-slate-500 mb-6 uppercase tracking-wider">Escaneie para participar</p>
                
                <div className="bg-white p-4 rounded-3xl border-2 border-indigo-50 shadow-inner inline-block mb-6">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-48 h-48 mx-auto rounded-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjggODBWMTc2IiBzdHJva2U9IiM2QjczODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik04MCAxMjhIMTc2IiBzdHJva2U9IiM2QjczODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg==';
                    }}
                  />
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 bg-slate-50 py-2 px-4 rounded-full mx-auto w-fit">
                  <span className={`w-2 h-2 rounded-full ${campaign.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {campaign.isActive ? 'Campanha Ativa' : 'Campanha Inativa'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-6 text-center text-slate-400 text-sm">
        © 2026 ExplicaAI Inc.
      </footer>
    </div>
  );
};
