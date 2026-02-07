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

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCampaignData) => campaignService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campanha criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar campanha');
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => campaignService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campanha deletada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao deletar campanha');
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
      toast.success('Campanha atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar campanha');
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
      toast.success('Status da campanha alterado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao alterar status da campanha');
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
      toast.success('Campanha iniciada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erro ao iniciar campanha');
    },
  });
};