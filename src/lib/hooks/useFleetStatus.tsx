import { useEffect, useState } from 'react';

type FleetStatusItem = {
  label: string;
  type: 'ok' | 'warning' | 'critical' | 'empty';
  isLoading?: boolean;
  isError?: boolean;
};

export function useFleetStatus() {
  const [fleetStatus, setFleetStatus] = useState<FleetStatusItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    console.log('[useFleetStatus] mounted - iniciando carregamento');

    const load = async () => {
      try {
        console.log('[useFleetStatus] simulando requisição (substitua por fetch real)');
        // Simulação de delay para visualizar logs; remova/alterar para chamada real à API
        await new Promise((res) => setTimeout(res, 500));

        // Se quiser testar com dados fictícios, descomente abaixo:
        // const data: FleetStatusItem[] = [
        //   { label: 'Vessel A', type: 'ok' },
        //   { label: 'Vessel B', type: 'warning' },
        // ];
        const data: FleetStatusItem[] = []; // sem dados por padrão

        setFleetStatus(data);
        console.log('[useFleetStatus] dados carregados:', data);
      } catch (err) {
        console.log('[useFleetStatus] erro ao carregar:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
        console.log('[useFleetStatus] carregamento finalizado - isLoading:false');
      }
    };

    load();
  }, []);

  useEffect(() => {
    console.log('[useFleetStatus] fleetStatus mudou - length:', fleetStatus.length, 'data:', fleetStatus);
  }, [fleetStatus]);

  return {
    fleetStatus,
    isLoading,
    isError
  };
}
