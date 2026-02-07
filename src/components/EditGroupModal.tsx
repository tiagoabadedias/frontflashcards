import React, { useState, useEffect } from 'react';
import { X, Users, Plus, Trash2, Save } from 'lucide-react';
import { useUpdateGroup, useAddParticipant, useRemoveParticipant } from '../hooks/useGroups';
import { Group } from '../types';

interface EditGroupModalProps {
  group: Group;
  onClose: () => void;
}

export const EditGroupModal: React.FC<EditGroupModalProps> = ({ group, onClose }) => {
  const [formData, setFormData] = useState({
    name: group.name,
    isActive: group.isActive ?? true,
  });
  
  const [participants, setParticipants] = useState<string[]>(group.participants || []);
  const [newParticipant, setNewParticipant] = useState('');

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

  const handleAddParticipant = async () => {
    const phoneNumber = newParticipant.trim();
    if (phoneNumber && !participants.includes(phoneNumber)) {
      try {
        await addParticipantMutation.mutateAsync({
          id: group._id!,
          phoneNumber,
        });
        // Atualizar estado local imediatamente
        setParticipants(prev => [...prev, phoneNumber]);
        setNewParticipant('');
      } catch (error) {
        // Erro já tratado pelo hook
      }
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Editar Grupo</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Grupo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o nome do grupo"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Grupo ativo
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
              disabled={updateGroupMutation.isPending || !formData.name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {updateGroupMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>

        {/* Seção de Participantes */}
        <div className="border-t p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            📱 Participantes ({participants.length})
          </h3>
          
          {/* Adicionar novo participante */}
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <label className="block text-xs font-medium text-blue-700 mb-2">
              Adicionar Telefone
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="tel"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Ex: 11999999999"
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                onClick={handleAddParticipant}
                disabled={!newParticipant.trim() || addParticipantMutation.isPending || participants.includes(newParticipant.trim())}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                title={participants.includes(newParticipant.trim()) ? "Telefone já cadastrado" : "Adicionar telefone"}
              >
                {addParticipantMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            </div>
            {participants.includes(newParticipant.trim()) && newParticipant.trim() && (
              <p className="text-xs text-red-600 mt-1">Este telefone já está cadastrado no grupo</p>
            )}
          </div>

          {/* Lista de participantes */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {participants.map((participant, index) => (
              <div key={`${participant}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{participant}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant(participant)}
                  disabled={removeParticipantMutation.isPending}
                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                  title={`Remover ${participant}`}
                >
                  {removeParticipantMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
            {participants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm">Nenhum participante no grupo</p>
                <p className="text-xs">Adicione telefones acima</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};