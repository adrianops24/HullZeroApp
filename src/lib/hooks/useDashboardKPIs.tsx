import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '~/src/services/services';
import type { DashboardKPIs } from '~/src/services/services';

export function useDashboardKPIs() {
  const { data, isLoading, isError } = useQuery<DashboardKPIs>({
    queryKey: ['dashboard-kpis'],
    queryFn: () => dashboardService.getKPIs()
  });

  return {
    kpis: data,
    isLoading,
    isError
  };
}
