import React from 'react';
import { Users, BarChart3, TrendingUp, Clock } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'amber';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color
}) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <div className="card p-6 flex items-start space-x-4">
      <div className={`p-3 rounded-xl ${colorStyles[color]} flex-shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

// Componente para exibir múltiplos KPIs
interface KPISectionProps {
  overview: {
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
  };
}

export const KPISection: React.FC<KPISectionProps> = ({ overview }) => {
  if (!overview) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        title="Adesão da Turma"
        value={overview.totalStudents || 0}
        subtitle={`de ${overview.totalGroupParticipants || 0} alunos totais`}
        icon={Users}
        color="blue"
      />
      
      <KPICard
        title="Taxa de Resposta"
        value={`${Math.round(overview.completionRate || 0)}%`}
        subtitle="das questões enviadas"
        icon={BarChart3}
        color="purple"
      />
      
      <KPICard
        title="Média de Notas"
        value={`${Math.round(overview.averageScore || 0)}%`}
        subtitle="desempenho geral"
        icon={TrendingUp}
        color="green"
      />
      
      <KPICard
        title="Tempo Médio"
        value={overview.averageResponseTime || '0min'}
        subtitle="por resposta"
        icon={Clock}
        color="amber"
      />
    </div>
  );
};
