import { useQuery } from '@tanstack/react-query';
import { questionService } from '../services/questionService';
import { QuestionQueryParams } from '../types';

export const useQuestions = (params?: QuestionQueryParams) => {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionService.getAll(params),
  });
};

export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => questionService.getById(id),
    enabled: !!id,
  });
};

export const useQuestionsStats = () => {
  return useQuery({
    queryKey: ['questions-stats'],
    queryFn: () => questionService.getStats(),
  });
};

export const useQuestionsCategories = () => {
  return useQuery({
    queryKey: ['questions-categories'],
    queryFn: () => questionService.getCategories(),
  });
};

export const useQuestionsTags = () => {
  return useQuery({
    queryKey: ['questions-tags'],
    queryFn: () => questionService.getTags(),
  });
};

export const useRandomQuestions = (limit: number = 10) => {
  return useQuery({
    queryKey: ['questions-random', limit],
    queryFn: () => questionService.getRandom(limit),
  });
};

export const useQuestionsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['questions-by-category', category],
    queryFn: () => questionService.getByCategory(category),
    enabled: !!category,
  });
};

export const useQuestionsByDifficulty = (difficulty: string) => {
  return useQuery({
    queryKey: ['questions-by-difficulty', difficulty],
    queryFn: () => questionService.getByDifficulty(difficulty),
    enabled: !!difficulty,
  });
};

// NOVOS hooks
export const useStudentStats = () => {
  return useQuery({
    queryKey: ['student-stats'],
    queryFn: () => questionService.getStudentStats(),
  });
};

export const useStudentsList = () => {
  return useQuery({
    queryKey: ['students-list'],
    queryFn: () => questionService.getStudentsList(),
  });
};