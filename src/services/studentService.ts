import { api } from './api';

export interface Student {
  phoneNumber: string;
  name: string;
  lastActive: string;
  totalQuestions: number;
  totalCampaigns: number;
  campaigns: { id: string; name: string }[];
}

export interface StudentTrack {
  campaignId: string;
  campaignName: string;
  totalQuestions: number;
  averageScore: number;
  questions: {
    questionId: string;
    question: string;
    answer: string;
    score: string;
    answeredAt: string;
    feedback: string;
    audioUrl?: string; // Adicionando campo para áudio
  }[];
}

export interface StudentDetails {
  phoneNumber: string;
  name: string;
  globalStats: {
    totalQuestions: number;
    averageScore: number;
    totalTracks: number;
  };
  tracks: StudentTrack[];
}

export const studentService = {
  getAll: async (): Promise<Student[]> => {
    // Temporariamente usando endpoint de desenvolvimento
    const response = await api.get('/students/dev-test');
    return response.data;
  },

  getDetails: async (phoneNumber: string): Promise<StudentDetails> => {
    // Temporariamente usando endpoint de desenvolvimento
    const response = await api.get(`/students/dev-test/${phoneNumber}`);
    return response.data;
  },
};
