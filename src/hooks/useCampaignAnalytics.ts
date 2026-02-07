import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { analyticsService, AnalyticsFilters, CampaignAnalyticsResponse } from '../services/analyticsService';

export const useCampaignAnalytics = (
  campaignId: string | undefined,
  filters: AnalyticsFilters = {},
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) => {
  return useQuery<CampaignAnalyticsResponse, Error>({
    queryKey: ['campaign-analytics', campaignId, filters],
    queryFn: () => {
      if (!campaignId) {
        throw new Error('Campaign ID is required');
      }
      return analyticsService.getCampaignAnalytics(campaignId, filters);
    },
    enabled: !!campaignId && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval || 30000, // Atualizar a cada 30 segundos
    staleTime: 10000, // Considerar dados stale após 10 segundos
  });
};

export const useAnalyticsFilters = () => {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    // Removido filtro padrão para mostrar todos os dados por padrão
  });

  const updateFilter = useCallback((key: keyof AnalyticsFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({}); // Limpar todos os filtros para mostrar todos os dados
  }, []);

  const applyDateRange = useCallback((startDate: string, endDate: string) => {
    setFilters(prev => ({
      ...prev,
      startDate,
      endDate,
      period: undefined // Remove period when using custom date range
    }));
  }, []);

  return {
    filters,
    updateFilter,
    clearFilters,
    applyDateRange,
    setFilters
  };
};

// Hook para exportação de dados
export const useAnalyticsExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = useCallback(async (
    campaignId: string,
    format: 'pdf' | 'excel' | 'csv',
    filters: AnalyticsFilters = {}
  ) => {
    try {
      setIsExporting(true);
      const blob = await analyticsService.exportAnalytics(campaignId, format, filters);
      
      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `campaign-analytics-${campaignId}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    exportData,
    isExporting
  };
};

// Hook para atualizações em tempo real (websocket)
export const useRealTimeUpdates = (campaignId: string | undefined) => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (!campaignId) return;

    // Aqui poderia implementar WebSocket para atualizações em tempo real
    // Por enquanto, vamos usar polling simples
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, [campaignId]);

  return lastUpdate;
};