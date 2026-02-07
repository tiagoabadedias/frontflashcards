import { api } from './api';
import { Group, CreateGroupData, GroupStats } from '../types';

export const groupService = {
  // Listar todos os grupos
  async getAll() {
    const response = await api.get<Group[]>('/groups');
    return response.data;
  },

  // Obter grupo por ID
  async getById(id: string) {
    const response = await api.get<Group>(`/groups/${id}`);
    return response.data;
  },

  // Criar novo grupo
  async create(data: CreateGroupData) {
    const response = await api.post<Group>('/groups', data);
    return response.data;
  },

  // Atualizar grupo
  async update(id: string, data: Partial<CreateGroupData>) {
    const response = await api.patch<Group>(`/groups/${id}`, data);
    return response.data;
  },

  // Deletar grupo
  async delete(id: string) {
    await api.delete(`/groups/${id}`);
  },

  // Adicionar participante ao grupo
  async addParticipant(id: string, phoneNumber: string) {
    const response = await api.post<Group>(`/groups/${id}/participants`, {
      phoneNumber,
    });
    return response.data;
  },

  // Remover participante do grupo
  async removeParticipant(id: string, phoneNumber: string) {
    const response = await api.delete<Group>(`/groups/${id}/participants/${phoneNumber}`);
    return response.data;
  },

  // Ativar grupo
  async activate(id: string) {
    const response = await api.patch<Group>(`/groups/${id}/activate`);
    return response.data;
  },

  // Desativar grupo
  async deactivate(id: string) {
    const response = await api.patch<Group>(`/groups/${id}/deactivate`);
    return response.data;
  },

  // Obter estatísticas dos grupos
  async getStats() {
    const response = await api.get<GroupStats>('/groups/stats');
    return response.data;
  },
};