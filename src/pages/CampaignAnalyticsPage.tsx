import React from 'react';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { useCampaignAnalytics, useAnalyticsFilters } from '../hooks/useCampaignAnalytics';
import { KPISection } from '../components/analytics/KPICards';
import { StudentList } from '../components/analytics/StudentList';
import { BarChart3 } from 'lucide-react';

export const CampaignAnalyticsPage: React.FC = () => {
  const { id: campaignId } = useParams<{ id: string }>();
  const { filters } = useAnalyticsFilters();

  const {
    data: analytics,
    isLoading,
    error,
  } = useCampaignAnalytics(campaignId, filters);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        title="Erro ao carregar dados analíticos"
        message={error.message || "Não foi possível carregar os dados. Tente novamente."}
      />
    );
  }

  if (!analytics) {
    return (
      <Alert
        type="warning"
        title="Nenhum dado encontrado"
        message="Não foi possível carregar os dados analíticos desta trilha."
      />
    );
  }

  const renderCampaignHeader = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          Dashboard Analítico
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl">
          Análise de performance para a trilha <span className="font-semibold text-gray-900">{analytics.campaignDetails?.name}</span>
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
          analytics.campaignDetails?.isActive 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-gray-50 text-gray-700 border-gray-200'
        }`}>
          {analytics.campaignDetails?.isActive ? 'Ativa' : 'Inativa'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {renderCampaignHeader()}
      
      <KPISection overview={analytics.overview} />
      
      <StudentList 
        students={analytics.studentAnalysis?.allStudents || []} 
        campaignId={campaignId}
      />
    </div>
  );
};
