import React from 'react';

interface AnalyticsFiltersProps {
  filters: {
    startDate?: string;
    endDate?: string;
    groups?: string[];
    categories?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
    period?: '7d' | '15d' | '30d';
  };
  onFilterChange: (key: string, value: any) => void;
  onClear: () => void;
  onRefresh: () => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFilterChange,
  onClear,
  onRefresh
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <span className="text-xl mr-2">🔍</span>
          FILTROS
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onClear}
            className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={onRefresh}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Atualizar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Período */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Período:
          </label>
          <select
            value={filters.period || '30d'}
            onChange={(e) => onFilterChange('period', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="15d">Últimos 15 dias</option>
            <option value="30d">Últimos 30 dias</option>
          </select>
        </div>

        {/* Dificuldade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dificuldade:
          </label>
          <select
            value={filters.difficulty || ''}
            onChange={(e) => onFilterChange('difficulty', e.target.value || undefined)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            <option value="easy">Fácil</option>
            <option value="medium">Médio</option>
            <option value="hard">Difícil</option>
          </select>
        </div>

        {/* Data início */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data início:
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange('startDate', e.target.value || undefined)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Data fim */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data fim:
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => onFilterChange('endDate', e.target.value || undefined)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};