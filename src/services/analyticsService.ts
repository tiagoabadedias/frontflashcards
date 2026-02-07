import { api } from './api';
import { Campaign } from '../types';

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  groups?: string[];
  categories?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  period?: '7d' | '15d' | '30d';
}

export interface CampaignOverview {
  totalStudents: number;
  activeStudents: number;
  totalQuestions: number;
  answeredQuestions: number;
  averageScore: number;
  completionRate: number;
  averageResponseTime: string;
  totalGroups: number;
  participationRate?: number;
  totalGroupParticipants?: number;
}

export interface TrendData {
  date: string;
  students: number;
  questions: number;
  performance?: number;
}

export interface QuestionAnalysis {
  questionId: string;
  text: string;
  category: string;
  difficulty: string;
  successRate: number;
  totalAttempts: number;
  avgTime: string;
}

export interface CategoryAnalysis {
  category: string;
  totalQuestions: number;
  avgScore: number;
  avgTime: string;
  completionRate: number;
}

export interface StudentSegment {
  count: number;
  percentage: number;
  criteria: string;
  students?: string[];
}

export interface StudentPerformer {
  studentId: string;
  name: string;
  phoneNumber: string;
  score: number;
  questionsAnswered: number;
  lastActivity: Date;
}

export interface StudentResult {
  phoneNumber: string;
  name: string;
  avgScore: number;
  questionsAnswered: number;
  questionsSent?: number;
  responseRate?: number;
  lastActivity: Date;
}

export interface GroupComparison {
  groupId: string;
  groupName: string;
  totalParticipants: number;
  totalResponses: number;
  averageScore: number;
  completionRate: number;
  averageResponseTime: string;
  students: number;
  activeRate: number;
  rank: number;
}

export interface GroupAnalysis {
  groupId: string;
  groupName: string;
  totalParticipants: number;
  totalResponses: number;
  averageScore: number;
  completionRate: number;
  averageResponseTime: string;
}

export interface ActivityAnalysis {
  hour?: number;
  day?: string;
  activityCount: number;
  avgPerformance?: number;
  completion?: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  description: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface CampaignAnalyticsResponse {
  overview: CampaignOverview;
  trends: {
    participationTrend: TrendData[];
    performanceTrend: TrendData[];
  };
  questionAnalysis: {
    topDifficult: QuestionAnalysis[];
    topEasy: QuestionAnalysis[];
    byCategory: CategoryAnalysis[];
    byType: Array<{ type: string; avgScore: number; count: number; }>;
    campaignQuestions?: Array<{
      questionId: string;
      text: string;
      category: string;
      difficulty: string;
      successRate: number;
      totalAttempts: number;
      avgTime: string;
      responses: number;
      avgScore: number;
    }>;
  };
  studentAnalysis: {
    studentSegments: {
      excellent: StudentSegment;
      good: StudentSegment;
      developing: StudentSegment;
      needsHelp: StudentSegment;
    };
    topPerformers: StudentPerformer[];
    inactive: StudentPerformer[];
    allStudents: StudentResult[];
  };
  temporalAnalysis: {
    hourlyActivity: ActivityAnalysis[];
    weeklyActivity: ActivityAnalysis[];
    responseTimeAnalysis: {
      byCategory: Array<{ category: string; avgTime: number; }>;
      byDifficulty: Array<{ difficulty: string; avgTime: number; }>;
    };
  };
  groupComparison: GroupComparison[];
  groupAnalysis?: GroupAnalysis[];
  alerts: Alert[];
  campaignDetails?: Campaign;
}

class AnalyticsService {
  async getCampaignAnalytics(
    campaignId: string, 
    filters: AnalyticsFilters = {}
  ): Promise<CampaignAnalyticsResponse> {
    console.log('AnalyticsService: Making API call for campaign:', campaignId);
    console.log('AnalyticsService: With filters:', filters);
    
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const url = `/campaigns/${campaignId}/analytics?${params.toString()}`;
    console.log('AnalyticsService: Full URL:', url);

    try {
      const response = await api.get(url);
      console.log('AnalyticsService: Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('AnalyticsService: Error occurred:', error);
      throw error;
    }
  }

  // Método para exportar dados
  async exportAnalytics(
    campaignId: string, 
    format: 'pdf' | 'excel' | 'csv' = 'pdf',
    filters: AnalyticsFilters = {}
  ): Promise<Blob> {
    const params = new URLSearchParams();
    params.append('format', format);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await api.get(`/campaigns/${campaignId}/analytics/export?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Obter detalhes de interação de um aluno
  async getStudentDetails(campaignId: string, phoneNumber: string): Promise<any> {
    const response = await api.get(`/campaigns/${campaignId}/students/${encodeURIComponent(phoneNumber)}/details`);
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();