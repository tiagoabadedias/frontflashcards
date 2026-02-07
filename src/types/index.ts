export interface Campaign {
  _id?: string;
  name: string;
  description?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  groups?: (Group | string)[]; // Aceita tanto objetos quanto IDs
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCampaignData {
  name: string;
  description?: string;
  isActive?: boolean | string;
  startDate?: string;
  endDate?: string;
  groups?: string[];
}

export interface Question {
  _id?: string;
  question: string;
  answer: string;
  
  // Campos do estudante (NOVOS)
  name?: string;
  phoneNumber?: string;
  profilePicture?: string;
  answeredAt?: string;
  expired?: string;
  
  // Campos de avaliação
  retornoAluno?: string; // Resposta do aluno
  nota?: string; // Nota atribuída
  resposta?: string; // Feedback do professor
  return?: boolean;
  urlAudioAluno?: string; // URL do áudio da resposta do aluno
  
  // Campos existentes
  category?: string;
  type?: 'multiple_choice' | 'true_false' | 'open_ended';
  difficulty?: 'easy' | 'medium' | 'hard';
  options?: string[];
  isActive?: boolean;
  campaign?: string | Campaign;
  explanation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  phoneNumber: string;
  averageScore: number; // Média das notas
  questionsCount: number;
  questions: Question[];
}

export interface GroupedQuestions {
  _id: string;
  campaignName: string;
  campaignIsActive: boolean;
  totalQuestions: number;
  students: Student[];
}

export interface QuestionsResponse {
  data: Question[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    pages: number;
    currentPage: number;
  };
}
export interface Group {
  _id?: string;
  name: string;
  description?: string;
  participants: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  participants?: string[];
  isActive?: boolean;
}

export interface GroupStats {
  total: number;
  active: number;
  inactive: number;
  totalParticipants: number;
}
export interface QueryParams {
  question?: string;
  category?: string;
  type?: string;
  difficulty?: string;
  isActive?: boolean;
  limit?: string;
  offset?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// NOVA interface para parâmetros de query de questões
export interface QuestionQueryParams extends QueryParams {
  campaignId?: string;
  studentName?: string;
  studentPhone?: string;
  hasResponse?: boolean;
  isEvaluated?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// NOVAS interfaces para questões da campanha
export interface CreateQuestionForCampaignData {
  question: string;
  answer: string;
  explanation?: string;
  isActive?: boolean;
}

export interface UpdateQuestionForCampaignData extends Partial<CreateQuestionForCampaignData> {}

export interface GenerateQuestionsData {
  quantity: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
  type?: 'multiple_choice' | 'true_false' | 'open_ended';
  category?: string;
}

export interface CampaignAnalyticsResponse {
  overview: {
    totalQuestions: number;
    activeStudents: number;
    responseRate: number;
    averageScore: number;
  };
  studentAnalysis: {
    allStudents: any[]; 
  };
  campaignDetails?: Campaign;
}
