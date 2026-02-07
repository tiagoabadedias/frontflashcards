import { useQuery } from '@tanstack/react-query';
import { questionService } from '../services/questionService';

export function useGroupedQuestions() {
  return useQuery({
    queryKey: ['questions', 'grouped-by-campaign'],
    queryFn: () => questionService.getGroupedByCampaign(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useQuestionsByCampaign(campaignId: string) {
  return useQuery({
    queryKey: ['questions', 'campaign', campaignId],
    queryFn: () => questionService.getByCampaign(campaignId),
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000,
  });
}