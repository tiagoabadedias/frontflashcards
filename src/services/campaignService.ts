import { api, publicApi } from './api';
import { 
  Campaign, 
  CreateCampaignData, 
  Question,
  CreateQuestionForCampaignData,
  UpdateQuestionForCampaignData,
  GenerateQuestionsData 
} from '../types';

export const campaignService = {
  // Listar todas as campanhas
  async getAll(params?: { name?: string; active?: string }) {
    const response = await api.get<Campaign[]>('/campaigns', { params });
    return response.data;
  },

  // Obter campanha por ID
  async getById(id: string) {
    const response = await api.get<Campaign>(`/campaigns/${id}`);
    return response.data;
  },

  // Obter campanha por ID (Público)
  async getPublicById(id: string) {
    const response = await publicApi.get<Campaign>(`/campaigns/public/${id}`);
    return response.data;
  },

  // Criar nova campanha
  async create(data: CreateCampaignData) {
    const response = await api.post<Campaign>('/campaigns', data);
    return response.data;
  },

  // Atualizar campanha
  async update(id: string, data: Partial<CreateCampaignData>) {
    const response = await api.patch<Campaign>(`/campaigns/${id}`, data);
    return response.data;
  },

  // Ativar campanha
  async activate(id: string) {
    const response = await api.patch<Campaign>(`/campaigns/${id}/activate`);
    return response.data;
  },

  // Desativar campanha
  async deactivate(id: string) {
    const response = await api.patch<Campaign>(`/campaigns/${id}/deactivate`);
    return response.data;
  },

  // Deletar campanha
  async delete(id: string) {
    await api.delete(`/campaigns/${id}`);
  },

  // Buscar campanhas ativas
  async getActive() {
    return this.getAll({ active: 'true' });
  },

  // Buscar por nome
  async getByName(name: string) {
    return this.getAll({ name });
  },

  // Iniciar campanha (chamar webhook e marcar como iniciada)
  async startCampaign(campaignData: {
    campaign: string;
    question: string;
    quantity: number;
    phoneNumbers: string[];
    questions?: Question[];
  }) {
    const webhookUrl = 'https://n8n.srv1008656.hstgr.cloud/webhook/775331c8-aeb6-482e-bb2c-e84db7166279';
    
    try {
      // 1. Marcar campanha como iniciada no backend
      await api.patch(`/campaigns/${campaignData.campaign}/start`);

      // 2. Continuar com o disparo do webhook
      // Se não foram passadas questões, buscar as questões da campanha
      let questions = campaignData.questions;
      if (!questions) {
        try {
          questions = await this.getCampaignQuestions(campaignData.campaign);
        } catch (error) {
          console.warn('Erro ao buscar questões da campanha:', error);
          questions = [];
        }
      }

      // Obter ID do usuário logado
      let userId = '';
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          userId = user.id;
        }
      } catch (e) {
        console.warn('Não foi possível obter o ID do usuário:', e);
      }

      // Dados finais a serem enviados
      const dataToSend = {
        ...campaignData,
        questions: questions,
        userId // Adiciona o userId ao payload
      };
      
      // const response = await fetch(webhookUrl, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify([dataToSend]),
      // });
      
      // if (!response.ok) {
      //   throw new Error(`Erro na requisição: ${response.status}`);
      // }
      
      // return await response.json();
    } catch (error) {
      console.error('Erro ao iniciar campanha:', error);
      throw error;
    }
  },

  // =============== MÉTODOS PARA QUESTÕES ===============

  // Buscar questões da campanha
  async getCampaignQuestions(campaignId: string) {
    const response = await api.get<Question[]>(`/campaigns/${campaignId}/questions`);
    return response.data;
  },

  // Criar questão para a campanha
  async createCampaignQuestion(campaignId: string, data: CreateQuestionForCampaignData) {
    const response = await api.post<Question>(`/campaigns/${campaignId}/questions`, data);
    return response.data;
  },

  // Atualizar questão da campanha
  async updateCampaignQuestion(campaignId: string, questionId: string, data: UpdateQuestionForCampaignData) {
    const response = await api.patch<Question>(`/campaigns/${campaignId}/questions/${questionId}`, data);
    return response.data;
  },

  // Deletar questão da campanha
  async deleteCampaignQuestion(campaignId: string, questionId: string) {
    await api.delete(`/campaigns/${campaignId}/questions/${questionId}`);
  },

  // Gerar questões automaticamente
  async generateCampaignQuestions(_campaignId: string, data: GenerateQuestionsData) {
    // Webhook para geração de questões
    const webhookUrl = 'https://n8n.srv1008656.hstgr.cloud/webhook/gerar-questions';
    
    try {
      // O webhook espera: assunto e questions (quantidade)
      const payload = {
        assunto: data.topic,
        questions: data.quantity
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const result = await response.json();
      
      // O webhook retorna um array de objetos com question, answer, etc.
      // Vamos garantir que o formato esteja correto para o nosso frontend
      return result.map((q: any) => ({
        question: q.question || q.pergunta,
        answer: q.answer || q.resposta,
        explanation: q.explanation || q.explicacao || '',
        isActive: true
      }));
    } catch (error) {
      console.error('Erro ao gerar questões:', error);
      throw error;
    }
  }
};