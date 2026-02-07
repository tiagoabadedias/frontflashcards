import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCampaigns, useCreateCampaign, useDeleteCampaign, useToggleCampaignStatus, useStartCampaign } from '../hooks/useCampaigns';
import { useGroups } from '../hooks/useGroups';
import { campaignService } from '../services/campaignService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { CreateCampaignData, Campaign } from '../types';
import { EditCampaignModal } from '../components/EditCampaignModal';
import { Plus, Edit, Trash2, Power, Calendar, Users, Play, BarChart3, Search } from 'lucide-react';
import { format } from 'date-fns';

export const CampaignsPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const navigate = useNavigate();

  const { data: campaigns, isLoading, error } = useCampaigns();
  const { data: allGroups } = useGroups();
  const createCampaignMutation = useCreateCampaign();
  const deleteCampaignMutation = useDeleteCampaign();
  const toggleStatusMutation = useToggleCampaignStatus();
  const startCampaignMutation = useStartCampaign();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCampaignData>();

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

  const onSubmit = async (data: CreateCampaignData) => {
    try {
      const formattedData = {
        ...data,
        isActive: data.isActive === 'true' || data.isActive === true,
      };
      await createCampaignMutation.mutateAsync(formattedData);
      reset();
      setShowCreateForm(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta campanha?')) {
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
    if (!campaign._id || !campaign.groups || campaign.groups.length === 0) {
      alert('Campanha deve ter grupos vinculados para ser iniciada.');
      return;
    }

    if (!allGroups) {
      alert('Carregando dados dos grupos. Tente novamente em alguns segundos.');
      return;
    }

    const phoneNumbers: string[] = [];
    
    campaign.groups.forEach((group) => {
      if (typeof group === 'object' && group.participants) {
        phoneNumbers.push(...group.participants);
      } else if (typeof group === 'string') {
        const fullGroup = allGroups.find(g => g._id === group);
        if (fullGroup && fullGroup.participants) {
          phoneNumbers.push(...fullGroup.participants);
        }
      }
    });

    if (phoneNumbers.length === 0) {
      alert('Nenhum participante encontrado nos grupos da campanha.');
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
        title="Erro ao carregar campanhas"
        message="Não foi possível carregar as campanhas. Tente novamente."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Campanhas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie suas campanhas de envio de flashcards
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/30"
        >
          <Plus className="w-4 h-4" />
          Nova Campanha
        </button>
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <div className="card p-6 animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Nova Campanha</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Nome da Campanha *</label>
                <input
                  {...register('name', { required: 'Nome é obrigatório' })}
                  type="text"
                  className="input"
                  placeholder="Ex: Revisão de Matemática - 1º Bimestre"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="label">Status Inicial</label>
                <div className="relative">
                  <select {...register('isActive')} className="input appearance-none">
                    <option value="true">Ativa</option>
                    <option value="false">Inativa</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="label">Descrição *</label>
              <textarea
                {...register('description', { required: 'Descrição é obrigatória' })}
                rows={3}
                className="input resize-none"
                placeholder="Descreva o objetivo desta campanha..."
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Data de Início</label>
                <input
                  {...register('startDate')}
                  type="date"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Data de Fim</label>
                <input
                  {...register('endDate')}
                  type="date"
                  className="input"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  reset();
                }}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createCampaignMutation.isPending}
                className="btn btn-primary min-w-[120px]"
              >
                {createCampaignMutation.isPending ? <LoadingSpinner size="sm" /> : 'Criar Campanha'}
              </button>
            </div>
          </form>
        </div>
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
                  Campanha
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
                        {campaign.isActive && campaign.groups && campaign.groups.length > 0 && (
                          <button
                            onClick={() => handleStartCampaign(campaign)}
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
    </div>
  );
};
