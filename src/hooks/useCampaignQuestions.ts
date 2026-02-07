import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { campaignService } from '../services/campaignService';
import { 
  CreateQuestionForCampaignData, 
  UpdateQuestionForCampaignData, 
  GenerateQuestionsData 
} from '../types';

// Hook para buscar questões da campanha
export const useCampaignQuestions = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaignQuestions', campaignId],
    queryFn: () => campaignService.getCampaignQuestions(campaignId),
    enabled: !!campaignId,
  });
};

// Hook para criar questão na campanha
export const useCreateCampaignQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ campaignId, data }: { 
      campaignId: string; 
      data: CreateQuestionForCampaignData 
    }) => campaignService.createCampaignQuestion(campaignId, data),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['campaignQuestions', campaignId] });
      toast.success('Questão criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar questão');
    },
  });
};

// Hook para atualizar questão da campanha
export const useUpdateCampaignQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ campaignId, questionId, data }: { 
      campaignId: string;
      questionId: string;
      data: UpdateQuestionForCampaignData 
    }) => campaignService.updateCampaignQuestion(campaignId, questionId, data),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['campaignQuestions', campaignId] });
      toast.success('Questão atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar questão');
    },
  });
};

// Hook para deletar questão da campanha
export const useDeleteCampaignQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ campaignId, questionId }: { 
      campaignId: string;
      questionId: string;
    }) => campaignService.deleteCampaignQuestion(campaignId, questionId),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['campaignQuestions', campaignId] });
      toast.success('Questão deletada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao deletar questão');
    },
  });
};

// Hook para gerar questões automaticamente (placeholder)
export const useGenerateCampaignQuestions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ campaignId, data }: { 
      campaignId: string; 
      data: GenerateQuestionsData 
    }) => campaignService.generateCampaignQuestions(campaignId, data),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['campaignQuestions', campaignId] });
      toast.success('Questões geradas com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao gerar questões');
    },
  });
};