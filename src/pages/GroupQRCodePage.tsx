import React from 'react';
import { useParams } from 'react-router-dom';
import { QrCode, Users, ExternalLink } from 'lucide-react';
import { useGroups } from '../hooks/useGroups';

export const GroupQRCodePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: groups = [], isLoading } = useGroups();

  const group = groups.find(g => g._id === id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <QrCode className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Grupo não encontrado</h2>
          <p className="text-gray-600">O grupo que você está procurando não existe ou foi removido.</p>
        </div>
      </div>
    );
  }

  const whatsappText = `Quero%20me%20inscrever%20no%20grupo%20FlashCards%20${group._id}`;
  const whatsappUrl = `https://wa.me/5551981354122?text=${whatsappText}`;
  const qrCodeUrl = `https://api-qrcode-three.vercel.app/qrcode?text=${encodeURIComponent(whatsappUrl)}`;

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header do card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <div className="flex items-center mb-2">
              <Users className="w-8 h-8 mr-3" />
              <h1 className="text-2xl font-bold">Participe do Grupo</h1>
            </div>
            <h2 className="text-xl font-semibold opacity-90">{group.name}</h2>
            {group.description && (
              <p className="text-blue-100 mt-2">{group.description}</p>
            )}
          </div>

          {/* Conteúdo do card */}
          <div className="p-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Escaneie o QR Code para se inscrever via WhatsApp
              </h3>
              
              {/* QR Code */}
              <div className="bg-white p-6 rounded-2xl shadow-lg inline-block mb-6 border-2 border-gray-100">
                <img
                  src={qrCodeUrl}
                  alt="QR Code para participar do grupo"
                  className="w-64 h-64 mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjggODBWMTc2IiBzdHJva2U9IiM2QjczODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik04MCAxMjhIMTc2IiBzdHJva2U9IiM2QjczODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg==';
                  }}
                />
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  Ou clique no botão abaixo para abrir o WhatsApp diretamente:
                </p>

                <button
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Abrir WhatsApp
                </button>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Como funciona:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 text-left max-w-md mx-auto">
                    <li>• Escaneie o QR Code com seu celular</li>
                    <li>• Você será direcionado para o WhatsApp</li>
                    <li>• Uma mensagem de inscrição será criada automaticamente</li>
                    <li>• Envie a mensagem para confirmar sua participação</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do grupo */}
          <div className="bg-gray-50 px-8 py-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status do grupo:</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  group.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {group.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Participantes:</p>
                <span className="font-semibold text-gray-900">
                  {group.participants.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card de instruções adicionais */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Precisa de ajuda?</h3>
          <p className="text-sm text-gray-600">
            Se você tiver problemas para escanear o QR Code ou acessar o WhatsApp, 
            entre em contato com o administrador do grupo ou use o botão "Abrir WhatsApp" 
            diretamente.
          </p>
        </div>
      </div>
    </div>
  );
};