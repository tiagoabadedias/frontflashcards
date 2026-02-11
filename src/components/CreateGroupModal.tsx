import React, { useState } from 'react';
import { X, Users, Plus, Trash2 } from 'lucide-react';
import { useCreateGroup } from '../hooks/useGroups';

interface CreateGroupModalProps {
  onClose: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    participants: [''],
    isActive: true,
  });

  const createGroupMutation = useCreateGroup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredParticipants = formData.participants.filter(p => p.trim() !== '');
    
    try {
      await createGroupMutation.mutateAsync({
        ...formData,
        participants: filteredParticipants,
      });
      onClose();
    } catch (error) {
      // Erro já tratado pelo hook
    }
  };

  const addParticipantField = () => {
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, '']
    }));
  };

  const updateParticipant = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map((p, i) => i === index ? value : p)
    }));
  };

  const removeParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Criar Novo Grupo</h2>
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
              className="input"
              placeholder="Digite o nome do grupo"
              required
            />
          </div>

          <div>
            <label className="label">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input resize-none"
              placeholder="Descrição opcional do grupo"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">
                Participantes (Telefones)
              </label>
              <button
                type="button"
                onClick={addParticipantField}
                className="flex items-center px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded transition-colors font-medium"
              >
                <Plus className="w-3 h-3 mr-1" />
                Adicionar
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {formData.participants.map((participant, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="tel"
                    value={participant}
                    onChange={(e) => updateParticipant(index, e.target.value)}
                    className="input py-2"
                    placeholder="Ex: 11999999999"
                  />
                  {formData.participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Grupo ativo
            </label>
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createGroupMutation.isPending || !formData.name.trim()}
              className="btn btn-primary flex-1 flex items-center justify-center"
            >
              {createGroupMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Criar Grupo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};