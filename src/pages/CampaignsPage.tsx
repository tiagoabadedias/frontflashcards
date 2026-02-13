import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns, useDeleteCampaign, useToggleCampaignStatus, useStartCampaign } from '../hooks/useCampaigns';
import { useGroups } from '../hooks/useGroups';
import { campaignService } from '../services/campaignService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { Campaign } from '../types';
import { CreateCampaignModal } from '../components/CreateCampaignModal';
import { EditCampaignModal } from '../components/EditCampaignModal';
import { useOnboardingActions } from '../contexts/OnboardingActionsContext';
import { Plus, Edit, Trash2, Power, Users, Play, BarChart3, Search, QrCode } from 'lucide-react';
import { format } from 'date-fns';

export const CampaignsPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [confirmStartCampaign, setConfirmStartCampaign] = useState<Campaign | null>(null); // Estado para o modal de confirmação
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const navigate = useNavigate();

  const { registerActions, clearActions } = useOnboardingActions();

  const { data: campaigns, isLoading, error } = useCampaigns();
  const { data: allGroups } = useGroups();
  const deleteCampaignMutation = useDeleteCampaign();
  const toggleStatusMutation = useToggleCampaignStatus();
  const startCampaignMutation = useStartCampaign();

  useEffect(() => {
    registerActions({
      openCreateCampaignModal: () => setShowCreateForm(true),
    });

    return () => clearActions(['openCreateCampaignModal']);
  }, [clearActions, registerActions]);

  // Filter campaigns based on search term and active filter
  const filteredCampaigns = useMemo(() => {
    if (!Array.isArray(campaigns)) return [];
    
    let filtered = campaigns;

    if (searchTerm) {
      filtered = filtered.filter(campaign => 
        (campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (campaign.description && campaign.description.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (activeFilter !== 'all') {
      filtered = filtered.filter(campaign => 
        activeFilter === 'active' ? campaign.isActive : !campaign.isActive
      );
    }

    return filtered;
  }, [campaigns, searchTerm, activeFilter]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta trilha?')) {
      try {
        await deleteCampaignMutation.mutateAsync(id);
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  const handleToggleStatus = async (campaign: Campaign) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: campaign._id!,
        isActive: campaign.isActive!
      });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleStartCampaign = async (campaign: Campaign) => {
    // Abre o modal de confirmação em vez de iniciar imediatamente
    setConfirmStartCampaign(campaign);
  };

  const confirmStart = async () => {
    if (!confirmStartCampaign) return;
    const campaign = confirmStartCampaign;

    if (!campaign._id || !campaign.groups || campaign.groups.length === 0) {
      alert('Trilha deve ter grupos vinculados para ser iniciada.');
      setConfirmStartCampaign(null);
      return;
    }
    
    // ... restante da validação ...

    if (!allGroups) {
      alert('Carregando dados dos grupos. Tente novamente em alguns segundos.');
      setConfirmStartCampaign(null);
      return;
    }

    const phoneNumbers: string[] = [];
    
    campaign.groups.forEach((group) => {
      if (group && typeof group === 'object' && 'participants' in group) {
        phoneNumbers.push(...(group.participants || []));
      } else if (typeof group === 'string') {
        const fullGroup = allGroups.find(g => g._id === group);
        if (fullGroup && fullGroup.participants) {
          phoneNumbers.push(...fullGroup.participants);
        }
      }
    });

    if (phoneNumbers.length === 0) {
      alert('Nenhum participante encontrado nos grupos da trilha.');
      setConfirmStartCampaign(null);
      return;
    }

    try {
      const campaignQuestions = await campaignService.getCampaignQuestions(campaign._id);
      
      await startCampaignMutation.mutateAsync({
        campaign: campaign._id,
        question: campaign.description || campaign.name,
        quantity: 1,
        phoneNumbers: phoneNumbers,
        questions: campaignQuestions
      });
      
      setConfirmStartCampaign(null); // Fecha o modal
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        title="Erro ao carregar trilhas"
        message="Não foi possível carregar as trilhas. Tente novamente."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Trilhas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie suas trilhas de envio de flashcards
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          data-tour="campaigns-new"
          className="btn btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/30"
        >
          <Plus className="w-4 h-4" />
          Nova Trilha
        </button>
      </div>

      {/* Create Campaign Modal */}
      {showCreateForm && (
        <CreateCampaignModal onClose={() => setShowCreateForm(false)} />
      )}

      {/* Filters & Search */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'active', label: 'Ativas' },
              { id: 'inactive', label: 'Inativas' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns Table List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trilha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grupos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Nenhuma campanha encontrada com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{campaign.name}</span>
                        <span className="text-xs text-gray-500 line-clamp-1 max-w-xs">{campaign.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {campaign.groups && campaign.groups.length > 0 ? (
                          <span className="font-medium">
                            {campaign.groups.filter(g => g).length} grupo(s)
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Sem grupos</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col text-xs text-gray-500">
                        {campaign.startDate && (
                          <div className="flex items-center mb-1">
                            <span className="w-12">Início:</span>
                            <span className="font-medium text-gray-900">
                              {(() => {
                                try { return format(new Date(campaign.startDate), 'dd/MM/yyyy'); } catch { return '-'; }
                              })()}
                            </span>
                          </div>
                        )}
                        {campaign.endDate && (
                          <div className="flex items-center">
                            <span className="w-12">Fim:</span>
                            <span className="font-medium text-gray-900">
                              {(() => {
                                try { return format(new Date(campaign.endDate), 'dd/MM/yyyy'); } catch { return '-'; }
                              })()}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {campaign.isActive && campaign.groups && campaign.groups.length > 0 && !campaign.hasStarted && (
                          <button
                            onClick={() => handleStartCampaign(campaign)}
                            data-tour="campaigns-start"
                            disabled={startCampaignMutation.isPending}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Iniciar Disparo"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => navigate(`/campaigns/${campaign._id}/analytics`)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Analytics"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>

                        {/* QR Code visível apenas se a trilha já foi iniciada */}
                        {campaign.hasStarted && (
                          <button
                            onClick={() => window.open(`/campaigns/${campaign._id}/qrcode`, '_blank')}
                            data-tour="campaigns-qrcode"
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="QR Code de Inscrição"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setEditingCampaign(campaign)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(campaign)}
                          disabled={toggleStatusMutation.isPending}
                          className={`p-1.5 rounded-lg transition-colors ${
                            campaign.isActive
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={campaign.isActive ? 'Desativar' : 'Ativar'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(campaign._id!)}
                          disabled={deleteCampaignMutation.isPending}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Campaign Modal */}
      {editingCampaign && (
        <EditCampaignModal
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
        />
      )}

      {/* Confirmation Modal */}
      {confirmStartCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Iniciar Trilha?</h3>
            <p className="text-gray-600 mb-6">
              Você tem certeza que deseja iniciar a trilha <strong>{confirmStartCampaign.name}</strong>?
              <br /><br />
              <span className="text-red-600 font-medium">Atenção:</span> Após confirmar, o QRcode ficará disponível e a trilha será iniciada. Você não poderá executar esta ação novamente para esta trilha nesta sessão.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmStartCampaign(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmStart}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Confirmar e Iniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
