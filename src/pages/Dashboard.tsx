import { useQuery } from '@tanstack/react-query';
import { useCampaigns } from '../hooks/useCampaigns';
import { dashboardService } from '../services/dashboardService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { CampaignPerformanceChart } from '../components/analytics/CampaignPerformanceChart';
import { Target, TrendingUp, CheckCircle, Clock, Users, MessageSquare, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { data: campaigns, isLoading: campaignsLoading, error: campaignsError } = useCampaigns();
  
  // Buscar estatísticas reais do backend
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardService.getStats(),
  });

  if (campaignsLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (campaignsError || statsError) {
    return (
      <Alert
        type="error"
        title="Erro ao carregar dados"
        message="Não foi possível carregar os dados do dashboard. Tente novamente."
      />
    );
  }

  // Cards principais atualizados com dados reais
  const dashboardStats = [
    {
      name: 'Alunos Alcançados',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Campanhas Ativas',
      value: stats?.activeCampaigns || 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      name: 'Interações Totais',
      value: stats?.totalInteractions || 0,
      icon: MessageSquare,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
    {
      name: 'Taxa de Resposta',
      value: `${stats?.responseRate || 0}%`,
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visão geral do sistema de flashcards
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/campaigns" className="btn btn-primary shadow-lg shadow-primary-500/30 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Nova Campanha
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div key={stat.name} className="card p-6 card-hover flex items-center transition-all duration-300">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="card p-6 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <div>
               <p className="text-gray-400 text-sm font-medium mb-1">Nota Média Geral</p>
               <h3 className="text-3xl font-bold">{stats?.averageScore || '0.0'}</h3>
               <p className="text-xs text-gray-400 mt-2">Performance global da turma</p>
            </div>
            <div className="p-4 bg-white/10 rounded-full">
               <BarChart3 className="w-8 h-8 text-white" />
            </div>
         </div>

         <div className="card p-6 flex items-center justify-between border-primary-100 bg-primary-50/50">
            <div>
               <p className="text-primary-800 text-sm font-medium mb-1">Total de Campanhas Criadas</p>
               <h3 className="text-3xl font-bold text-primary-900">{stats?.totalCampaigns || 0}</h3>
               <p className="text-xs text-primary-600 mt-2">Desde o início do uso</p>
            </div>
            <div className="p-4 bg-primary-100 rounded-full">
               <Target className="w-8 h-8 text-primary-600" />
            </div>
         </div>
      </div>

      {/* Chart Section */}
      <CampaignPerformanceChart />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Campaigns */}
        <div className="card lg:col-span-2 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Campanhas Recentes</h3>
            <Link to="/campaigns" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Ver todas
            </Link>
          </div>
          <div className="flex-1 overflow-auto">
             {Array.isArray(campaigns) && campaigns.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {campaigns.slice(0, 5).map((campaign) => (
                    <div key={campaign._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center mb-1">
                           <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                              {campaign.name}
                           </p>
                           {campaign.isActive && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Ativa
                              </span>
                           )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{campaign.description || 'Sem descrição'}</p>
                      </div>
                      <div className="flex items-center text-gray-400 text-xs">
                         <Clock className="w-3 h-3 mr-1" />
                         {new Date(campaign.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
             ) : (
                <div className="p-8 text-center text-gray-500">
                   Nenhuma campanha encontrada.
                </div>
             )}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
           <div className="card p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white border-none shadow-lg shadow-primary-500/20">
              <h3 className="text-lg font-bold mb-2">Dica Rápida</h3>
              <p className="text-primary-100 text-sm mb-4">
                 Crie perguntas engajadoras para aumentar a taxa de resposta dos seus alunos.
              </p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors backdrop-blur-sm border border-white/20">
                 Ver Melhores Práticas
              </button>
           </div>
           
           <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Status do Sistema</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center">
                       <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                       API
                    </span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Online</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center">
                       <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                       WhatsApp
                    </span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Conectado</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center">
                       <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                       Database
                    </span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Estável</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
