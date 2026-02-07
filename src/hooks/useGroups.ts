import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '../services/groupService';
import { CreateGroupData } from '../types';
import { toast } from 'react-toastify';

export const useGroups = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: () => groupService.getAll(),
  });
};

export const useGroup = (id: string) => {
  return useQuery({
    queryKey: ['group', id],
    queryFn: () => groupService.getById(id),
    enabled: !!id,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateGroupData) => groupService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Grupo criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar grupo');
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGroupData> }) => 
      groupService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Grupo atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar grupo');
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => groupService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Grupo deletado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao deletar grupo');
    },
  });
};

export const useAddParticipant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, phoneNumber }: { id: string; phoneNumber: string }) => 
      groupService.addParticipant(id, phoneNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Participante adicionado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao adicionar participante');
    },
  });
};

export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, phoneNumber }: { id: string; phoneNumber: string }) => 
      groupService.removeParticipant(id, phoneNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Participante removido com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao remover participante');
    },
  });
};

export const useToggleGroupStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      isActive ? groupService.activate(id) : groupService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Status do grupo atualizado!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar status');
    },
  });
};

export const useGroupStats = () => {
  return useQuery({
    queryKey: ['group-stats'],
    queryFn: () => groupService.getStats(),
  });
};