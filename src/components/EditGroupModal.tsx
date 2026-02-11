import React, { useState, useEffect } from 'react';
import { X, Users, Plus, Trash2, Save, Settings, Phone, AlertCircle } from 'lucide-react';
import { useUpdateGroup, useAddParticipant, useRemoveParticipant } from '../hooks/useGroups';
import { Group } from '../types';

interface EditGroupModalProps {
  group: Group;
  onClose: () => void;
}

export const EditGroupModal: React.FC<EditGroupModalProps> = ({ group, onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'participants'>('general');
  const [formData, setFormData] = useState({
    name: group.name,
    isActive: group.isActive ?? true,
  });
  
  const [participants, setParticipants] = useState<string[]>(group.participants || []);
  const [newParticipant, setNewParticipant] = useState('');
  const [error, setError] = useState('');

  const updateGroupMutation = useUpdateGroup();
  const addParticipantMutation = useAddParticipant();
  const removeParticipantMutation = useRemoveParticipant();

  // Atualizar lista local quando o grupo mudar
  useEffect(() => {
    setParticipants(group.participants || []);
  }, [group.participants]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateGroupMutation.mutateAsync({
        id: group._id!,
        data: formData,
      });
      onClose();
    } catch (error) {
      // Erro já tratado pelo hook
    }
  };

  const validatePhone = (phone: string) => {
    // Validação simples: remove não-números e verifica tamanho mínimo
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10;
  };

  const handleAddParticipant = async () => {
    const phoneNumber = newParticipant.trim();
    setError('');

    if (!phoneNumber) return;

    if (!validatePhone(phoneNumber)) {
      setError('Telefone inválido. Digite pelo menos 10 números.');
      return;
    }

    if (participants.includes(phoneNumber)) {
      setError('Este telefone já está cadastrado no grupo.');
      return;
    }

    try {
      await addParticipantMutation.mutateAsync({
        id: group._id!,
        phoneNumber,
      });
      // Atualizar estado local imediatamente
      setParticipants(prev => [...prev, phoneNumber]);
      setNewParticipant('');
    } catch (error) {
      setError('Erro ao adicionar participante.');
    }
  };

  const handleRemoveParticipant = async (phoneNumber: string) => {
    if (window.confirm(`Tem certeza que deseja remover ${phoneNumber}?`)) {
      try {
        await removeParticipantMutation.mutateAsync({
          id: group._id!,
          phoneNumber,
        });
        // Atualizar estado local imediatamente
        setParticipants(prev => prev.filter(p => p !== phoneNumber));
      } catch (error) {
        // Erro já tratado pelo hook
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddParticipant();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Editar Grupo</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'general'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            Geral
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'participants'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4" />
            Participantes
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
              {participants.length}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label">
                  Nome do Grupo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                  placeholder="Digite o nome do grupo"
                  required
                />
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer select-none">
                  Grupo Ativo
                  <p className="text-xs text-gray-500 font-normal mt-0.5">
                    Grupos inativos não recebem disparos de novas campanhas.
                  </p>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={updateGroupMutation.isPending || !formData.name.trim()}
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  {updateGroupMutation.isPending ? (
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
          ) : (
            <div className="space-y-6">
              {/* Adicionar Participante */}
              <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100 space-y-3">
                <label className="block text-xs font-semibold text-primary-700 uppercase tracking-wider">
                  Adicionar Novo Participante
                </label>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={newParticipant}
                      onChange={(e) => {
                        setNewParticipant(e.target.value);
                        setError('');
                      }}
                      className={`input pl-10 py-2 text-sm ${error ? 'border-red-300 focus:ring-red-200' : ''}`}
                      placeholder="Ex: 11999999999"
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <button
                    onClick={handleAddParticipant}
                    disabled={!newParticipant.trim() || addParticipantMutation.isPending}
                    className="btn btn-primary px-4 py-2 shadow-none disabled:opacity-70"
                  >
                    {addParticipantMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {error && (
                  <div className="flex items-center text-xs text-red-600 font-medium animate-fade-in">
                    <AlertCircle className="w-3 h-3 mr-1.5" />
                    {error}
                  </div>
                )}
              </div>

              {/* Lista */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
                  Lista de Membros
                </h3>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {participants.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                      <Users className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                      <p className="text-sm font-medium text-gray-900">Nenhum participante</p>
                      <p className="text-xs text-gray-500 mt-1">Adicione números de telefone acima</p>
                    </div>
                  ) : (
                    participants.map((participant, index) => (
                      <div 
                        key={`${participant}-${index}`} 
                        className="group flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full flex items-center justify-center text-primary-600 text-xs font-bold border border-primary-100">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-gray-700 font-mono tracking-wide">
                            {participant}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveParticipant(participant)}
                          disabled={removeParticipantMutation.isPending}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Remover participante"
                        >
                          {removeParticipantMutation.isPending ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer (Apenas botões de fechar se necessário, ou vazio já que as ações estão dentro das abas) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-secondary text-sm py-2"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};