import React, { useState } from 'react';
import { X, Save, Calendar, Users, Plus, Settings, HelpCircle } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex">
        {/* Sidebar com navegação */}
        <div className="w-1/4 bg-gray-50 p-4 rounded-l-lg border-r">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Editar Campanha</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection('basic')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 transition-colors ${
                activeSection === 'basic' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Dados Básicos</span>
            </button>
            <button
              onClick={() => setActiveSection('groups')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 transition-colors ${
                activeSection === 'groups' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Grupos</span>
            </button>
            <button
              onClick={() => setActiveSection('questions')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 transition-colors ${
                activeSection === 'questions' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Questões</span>
            </button>
          </nav>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              {activeSection === 'basic' && 'Dados Básicos'}
              {activeSection === 'groups' && 'Gerenciar Grupos'}
              {activeSection === 'questions' && 'Gerenciar Questões'}
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo scrollável */}
          <div className="flex-1 p-6 overflow-y-auto">
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
                setFormData={setFormData}
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome da Campanha *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Digite o nome da campanha"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            Data de Início
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            Data de Fim
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, isActive: e.target.checked }))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
          Campanha ativa
        </label>
      </div>

      <div className="flex items-center space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={updateCampaignMutation.isPending || !formData.name.trim()}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {updateCampaignMutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// Componente para seção de grupos
interface GroupsSectionProps {
  formData: any;
  setFormData: any;
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
  setFormData,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Users className="w-4 h-4 inline mr-1" />
          Grupos Vinculados
        </label>

        {/* Adicionar novos grupos */}
        {availableGroups.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <select
              value={selectedGroupToAdd}
              onChange={(e) => setSelectedGroupToAdd(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um grupo para adicionar...</option>
              {availableGroups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name} ({group.participants.length} participantes)
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddGroup}
              disabled={!selectedGroupToAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </button>
          </div>
        )}

        <div className="space-y-2">
          {selectedGroupsData.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedGroupsData.map((group) => (
                <div
                  key={group._id}
                  className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span className="font-medium mr-2">{group.name}</span>
                  <span className="text-xs bg-blue-200 px-2 py-0.5 rounded-full mr-2">
                    {group.participants.length} participantes
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGroup(group._id!)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title={`Remover ${group.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Nenhum grupo vinculado</p>
              <p className="text-xs text-gray-400">
                {groups.length === 0 
                  ? 'Nenhum grupo disponível' 
                  : 'Selecione grupos no campo acima para vincular'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={updateCampaignMutation.isPending}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {updateCampaignMutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </button>
      </div>
    </form>
  );
};