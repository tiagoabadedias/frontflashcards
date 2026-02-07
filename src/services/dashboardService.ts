import { api } from './api';

export interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalStudents: number;
  totalInteractions: number;
  responseRate: number;
  averageScore: number;
}

export interface ChartData {
  campaignId: string;
  campaignName: string;
  sent: number;
  answered: number;
  goodPerformance: number;
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/campaigns/dashboard/stats');
    return response.data;
  }

  async getChartData(campaignId?: string): Promise<ChartData[]> {
    const params = campaignId ? `?campaignId=${campaignId}` : '';
    const response = await api.get(`/campaigns/dashboard/chart-data${params}`);
    return response.data;
  }
}

export const dashboardService = new DashboardService();
