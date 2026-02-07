import { api } from './api';
import { Question, QuestionQueryParams, QuestionsResponse } from '../types';

export const questionService = {
  // Listar todas as questões com filtros
  async getAll(params?: QuestionQueryParams): Promise<QuestionsResponse> {
    const response = await api.get('/questions', { params });
    return response.data;
  },

  // Obter questão por ID
  async getById(id: string) {
    const response = await api.get<Question>(`/questions/${id}`);
    return response.data;
  },

  // Obter questões agrupadas por campanha
  async getGroupedByCampaign() {
    const response = await api.get('/questions/grouped-by-campaign');
    return response.data;
  },

  // Obter questões por campanha
  async getByCampaign(campaignId: string) {
    const response = await api.get(`/questions/campaign/${campaignId}`);
    return response.data;
  },

  // Obter estatísticas
  async getStats() {
    const response = await api.get('/questions/stats');
    return response.data;
  },

  // Obter categorias
  async getCategories() {
    const response = await api.get<string[]>('/questions/categories');
    return response.data;
  },

  // Obter tags
  async getTags() {
    const response = await api.get<string[]>('/questions/tags');
    return response.data;
  },

  // Obter questões aleatórias
  async getRandom(limit: number = 10) {
    const response = await api.get<Question[]>(`/questions/random?limit=${limit}`);
    return response.data;
  },

  // Obter por categoria
  async getByCategory(category: string) {
    const response = await api.get<Question[]>(`/questions/category/${category}`);
    return response.data;
  },

  // Obter por dificuldade
  async getByDifficulty(difficulty: string) {
    const response = await api.get<Question[]>(`/questions/difficulty/${difficulty}`);
    return response.data;
  },

  // NOVOS métodos
  async getStudentStats() {
    const response = await api.get('/questions/student-stats');
    return response.data;
  },

  async getStudentsList(): Promise<Array<{ phoneNumber: string; name: string; profilePicture?: string }>> {
    const response = await api.get('/questions/students');
    return response.data;
  }
};