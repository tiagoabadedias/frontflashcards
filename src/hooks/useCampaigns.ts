import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '../services/campaignService';
import { CreateCampaignData } from '../types';
import { toast } from 'react-toastify';

export const useCampaigns = (params?: { name?: string; active?: string }) => {
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: () => campaignService.getAll(params),
  });
};

export const useCampaign = (id: string) => {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignService.getById(id),
    enabled: !!id,
  });
};

export const usePublicCampaign = (id: string) => {
  return useQuery({
    queryKey: ['public-campaign', id],
    queryFn: () => campaignService.getPublicById(id),
    enabled: !!id,
    retry: false, // Não tentar novamente se falhar (ex: 404)
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCampaignData) => campaignService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Trilha criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar trilha');
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => campaignService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Trilha deletada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao deletar trilha');
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCampaignData> }) =>
      campaignService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      toast.success('Trilha atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar trilha');
    },
  });
};

export const useToggleCampaignStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      isActive ? campaignService.deactivate(id) : campaignService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Status da trilha alterado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao alterar status da trilha');
    },
  });
};

export const useStartCampaign = () => {
  return useMutation({
    mutationFn: (campaignData: {
      campaign: string;
      question: string;
      quantity: number;
      phoneNumbers: string[];
      questions?: any[];
    }) => campaignService.startCampaign(campaignData),
    onSuccess: () => {
      toast.success('Trilha iniciada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erro ao iniciar trilha');
    },
  });
};