import React, { useState, useEffect, useCallback } from 'react';
import { QuestionQueryParams } from '../types';
import { useCampaigns } from '../hooks/useCampaigns';

interface QuestionFiltersProps {
  onFiltersChange: (filters: QuestionQueryParams) => void;
  initialFilters?: QuestionQueryParams;
}

export const QuestionFilters: React.FC<QuestionFiltersProps> = ({ 
  onFiltersChange, 
  initialFilters = {} 
}) => {
  const [filters, setFilters] = useState<QuestionQueryParams>(initialFilters);
  const [localFilters, setLocalFilters] = useState<QuestionQueryParams>(initialFilters);

  const { data: campaignsData } = useCampaigns();
  const campaigns = Array.isArray(campaignsData) ? campaignsData : [];

  // Debounce para campos de texto
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (JSON.stringify(localFilters) !== JSON.stringify(filters)) {
        setFilters(localFilters);
        onFiltersChange(localFilters);
      }
    }, 500); // 500ms de debounce

    return () => clearTimeout(timeoutId);
  }, [localFilters, filters, onFiltersChange]);

  const handleFilterChange = useCallback((key: keyof QuestionQueryParams, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSelectChange = useCallback((key: keyof QuestionQueryParams, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    setFilters(newFilters);
    onFiltersChange(newFilters);
  }, [localFilters, onFiltersChange]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Filtro por campanha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campanha
          </label>
          <select
            value={localFilters.campaignId || ''}
            onChange={(e) => handleSelectChange('campaignId', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas as campanhas</option>
            {campaigns.map((campaign) => (
              <option key={campaign._id} value={campaign._id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone
          </label>
          <input
            type="text"
            placeholder="Número do telefone..."
            value={localFilters.studentPhone || ''}
            onChange={(e) => handleFilterChange('studentPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filtro por nome da pessoa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Pessoa
          </label>
          <input
            type="text"
            placeholder="Nome do estudante..."
            value={localFilters.studentName || ''}
            onChange={(e) => handleFilterChange('studentName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};