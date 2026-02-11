import React, { useState } from 'react';
import { X, Save, Calendar, Users, Plus, Settings, HelpCircle, Check, Trash2, Target } from 'lucide-react';
import { Campaign } from '../types';
import { useUpdateCampaign } from '../hooks/useCampaigns';
import { useGroups } from '../hooks/useGroups';
import { CampaignQuestionsSection } from './CampaignQuestionsSection';

interface EditCampaignModalProps {
  campaign: Campaign;
  onClose: () => void;
}

export const EditCampaignModal: React.FC<EditCampaignModalProps> = ({ 
  campaign, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    name: campaign.name,
    isActive: campaign.isActive ?? true,
    startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
    endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
    selectedGroups: (campaign.groups || []).map(g => {
      // Tratar tanto objetos quanto strings
      return typeof g === 'string' ? g : g._id!;
    }),
  });

  const [selectedGroupToAdd, setSelectedGroupToAdd] = useState('');
  const [activeSection, setActiveSection] = useState<'basic' | 'groups' | 'questions'>('basic');

  const updateCampaignMutation = useUpdateCampaign();
  const { data: groups = [] } = useGroups();

  // Filtrar grupos que ainda não foram selecionados
  const availableGroups = groups.filter(group => 
    !formData.selectedGroups.includes(group._id!)
  );

  const selectedGroupsData = groups.filter(group => 
    formData.selectedGroups.includes(group._id!)
  );

  const handleAddGroup = () => {
    if (selectedGroupToAdd && !formData.selectedGroups.includes(selectedGroupToAdd)) {
      setFormData(prev => ({
        ...prev,
        selectedGroups: [...prev.selectedGroups, selectedGroupToAdd]
      }));
      setSelectedGroupToAdd('');
    }
  };

  const handleRemoveGroup = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedGroups: prev.selectedGroups.filter(id => id !== groupId)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex overflow-hidden">
        {/* Sidebar com navegação */}
        <div className="w-64 bg-gray-50 border-r border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Editar Trilha</h2>
            <p className="text-xs text-gray-500 mt-1 truncate" title={campaign.name}>{campaign.name}</p>
          </div>
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            <button
              onClick={() => setActiveSection('basic')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                activeSection === 'basic' 
                ? 'bg-white text-primary-600 shadow-sm border border-gray-100' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className={`p-1.5 rounded-md ${activeSection === 'basic' ? 'bg-primary-50' : 'bg-transparent'}`}>
                <Settings className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">Dados Básicos</span>
            </button>
            <button
              onClick={() => setActiveSection('groups')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                activeSection === 'groups' 
                ? 'bg-white text-primary-600 shadow-sm border border-gray-100' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className={`p-1.5 rounded-md ${activeSection === 'groups' ? 'bg-primary-50' : 'bg-transparent'}`}>
                <Users className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">Grupos</span>
              {formData.selectedGroups.length > 0 && (
                <span className="ml-auto bg-primary-100 text-primary-700 py-0.5 px-2 rounded-full text-xs font-medium">
                  {formData.selectedGroups.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSection('questions')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                activeSection === 'questions' 
                ? 'bg-white text-primary-600 shadow-sm border border-gray-100' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className={`p-1.5 rounded-md ${activeSection === 'questions' ? 'bg-primary-50' : 'bg-transparent'}`}>
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">Questões</span>
            </button>
          </nav>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Header Mobile/Content */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {activeSection === 'basic' && 'Dados Básicos'}
                {activeSection === 'groups' && 'Gerenciar Grupos'}
                {activeSection === 'questions' && 'Gerenciar Questões'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {activeSection === 'basic' && 'Atualize as informações principais da trilha.'}
                {activeSection === 'groups' && 'Adicione ou remova grupos de alunos desta trilha.'}
                {activeSection === 'questions' && 'Visualize e gerencie as perguntas desta trilha.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo scrollável */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            {activeSection === 'basic' && (
              <BasicInfoSection 
                formData={formData}
                setFormData={setFormData}
                updateCampaignMutation={updateCampaignMutation}
                campaign={campaign}
                onClose={onClose}
              />
            )}
            
            {activeSection === 'groups' && (
              <GroupsSection 
                formData={formData}
                selectedGroupToAdd={selectedGroupToAdd}
                setSelectedGroupToAdd={setSelectedGroupToAdd}
                groups={groups}
                availableGroups={availableGroups}
                selectedGroupsData={selectedGroupsData}
                handleAddGroup={handleAddGroup}
                handleRemoveGroup={handleRemoveGroup}
                updateCampaignMutation={updateCampaignMutation}
                campaign={campaign}
                onClose={onClose}
              />
            )}
            
            {activeSection === 'questions' && (
              <CampaignQuestionsSection campaign={campaign} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para seção de dados básicos
interface BasicInfoSectionProps {
  formData: any;
  setFormData: any;
  updateCampaignMutation: any;
  campaign: Campaign;
  onClose: () => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  setFormData,
  updateCampaignMutation,
  campaign,
  onClose
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: any = {
      name: formData.name,
      isActive: formData.isActive,
      groups: formData.selectedGroups,
    };

    if (formData.startDate) {
      submitData.startDate = new Date(formData.startDate).toISOString();
    }

    if (formData.endDate) {
      submitData.endDate = new Date(formData.endDate).toISOString();
    }

    try {
      await updateCampaignMutation.mutateAsync({
        id: campaign._id!,
        data: submitData,
      });
      onClose();
    } catch (error) {
      // Erro já tratado pelo hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="label">
          Nome da Trilha *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
          className="input"
          placeholder="Digite o nome da trilha"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">
            <Calendar className="w-4 h-4 inline mr-1.5 text-gray-400" />
            Data de Início
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, startDate: e.target.value }))}
            className="input"
          />
        </div>

        <div>
          <label className="label">
            <Calendar className="w-4 h-4 inline mr-1.5 text-gray-400" />
            Data de Fim
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, endDate: e.target.value }))}
            className="input"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, isActive: e.target.checked }))}
            className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer select-none">
            Trilha ativa
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Trilhas inativas não ficam visíveis para os alunos.
            </p>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-6 border-t border-gray-100 mt-8">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={updateCampaignMutation.isPending || !formData.name.trim()}
          className="btn btn-primary flex items-center"
        >
          {updateCampaignMutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar Alterações
        </button>
      </div>
    </form>
  );
};

// Componente para seção de grupos
interface GroupsSectionProps {
  formData: any;
  selectedGroupToAdd: string;
  setSelectedGroupToAdd: any;
  groups: any[];
  availableGroups: any[];
  selectedGroupsData: any[];
  handleAddGroup: () => void;
  handleRemoveGroup: (id: string) => void;
  updateCampaignMutation: any;
  campaign: Campaign;
  onClose: () => void;
}

const GroupsSection: React.FC<GroupsSectionProps> = ({
  formData,
  selectedGroupToAdd,
  setSelectedGroupToAdd,
  groups,
  availableGroups,
  selectedGroupsData,
  handleAddGroup,
  handleRemoveGroup,
  updateCampaignMutation,
  campaign,
  onClose
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: any = {
      name: formData.name,
      isActive: formData.isActive,
      groups: formData.selectedGroups,
    };

    if (formData.startDate) {
      submitData.startDate = new Date(formData.startDate).toISOString();
    }

    if (formData.endDate) {
      submitData.endDate = new Date(formData.endDate).toISOString();
    }

    try {
      await updateCampaignMutation.mutateAsync({
        id: campaign._id!,
        data: submitData,
      });
      onClose();
    } catch (error) {
      // Erro já tratado pelo hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-primary-50/50 p-6 rounded-xl border border-primary-100">
        <label className="block text-xs font-bold text-primary-700 uppercase tracking-wider mb-4">
          Adicionar Novo Grupo
        </label>

        {availableGroups.length > 0 ? (
          <div className="flex gap-3">
            <div className="relative flex-1">
              <select
                value={selectedGroupToAdd}
                onChange={(e) => setSelectedGroupToAdd(e.target.value)}
                className="input appearance-none bg-white"
              >
                <option value="">Selecione um grupo para adicionar...</option>
                {availableGroups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name} ({group.participants.length} participantes)
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddGroup}
              disabled={!selectedGroupToAdd}
              className="btn btn-primary shadow-none disabled:opacity-70 flex items-center"
            >
              <Plus className="w-5 h-5 mr-1" />
              Adicionar
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">
            Todos os grupos disponíveis já foram adicionados.
          </div>
        )}
      </div>

      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
          <Users className="w-4 h-4 mr-2 text-gray-500" />
          Grupos Vinculados ({selectedGroupsData.length})
        </h4>

        {selectedGroupsData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedGroupsData.map((group) => (
              <div
                key={group._id}
                className="group flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm border border-primary-100">
                    {group.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="block font-medium text-gray-900">{group.name}</span>
                    <span className="block text-xs text-gray-500">
                      {group.participants.length} participantes
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveGroup(group._id!)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title={`Remover ${group.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Target className="mx-auto h-10 w-10 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-900">Nenhum grupo vinculado</p>
            <p className="text-xs text-gray-500 mt-1">
              Adicione grupos usando o formulário acima para que os alunos recebam esta trilha.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-6 border-t border-gray-100 mt-8">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={updateCampaignMutation.isPending}
          className="btn btn-primary flex items-center"
        >
          {updateCampaignMutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar Alterações
        </button>
      </div>
    </form>
  );
};
