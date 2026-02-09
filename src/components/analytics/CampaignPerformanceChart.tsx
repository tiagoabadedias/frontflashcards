import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboardService';
import { useCampaigns } from '../../hooks/useCampaigns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LoadingSpinner } from '../LoadingSpinner';
import { Alert } from '../Alert';
import { Filter } from 'lucide-react';

export const CampaignPerformanceChart: React.FC = () => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  
  // Buscar lista de campanhas para o filtro
  const { data: campaigns } = useCampaigns();

  // Buscar dados do gráfico
  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['dashboardChart', selectedCampaignId],
    queryFn: () => dashboardService.getChartData(selectedCampaignId || undefined),
  });

  if (isLoading) {
    return (
      <div className="h-80 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        title="Erro ao carregar gráfico"
        message="Não foi possível carregar os dados de performance."
      />
    );
  }

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Performance de Engajamento</h3>
          <p className="text-sm text-gray-500">Comparativo de envio, resposta e qualidade</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="input py-2 text-sm w-full sm:w-64"
          >
            <option value="">Todas as Trilhas (Top 5)</option>
            {campaigns?.map((campaign) => (
              <option key={campaign._id} value={campaign._id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="campaignName" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: '#F9FAFB' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
            />
            <Bar 
              name="Enviadas" 
              dataKey="sent" 
              fill="#60A5FA" // blue-400
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar 
              name="Respondidas" 
              dataKey="answered" 
              fill="#8B5CF6" // violet-500
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar 
              name="Nota > 6.0" 
              dataKey="goodPerformance" 
              fill="#10B981" // emerald-500
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
