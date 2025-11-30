/**
 * TrendsChart - Componente de gráfico para o Dashboard
 *
 * Requisitos:
 *   npm i react-native-chart-kit react-native-svg
 *
 * Props principais:
 *  - data: array de pontos { month, economy_brl, co2_tonnes, compliance_rate_percent, ... }
 *  - isLoading?: boolean
 *  - height?: number
 *  - visibleMetrics?: { economy?: boolean; co2?: boolean; compliance?: boolean; ... }
 *  - period?: string
 *  - onPeriodChange?: (period: string) => void
 */
import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import clsx from 'clsx';

type TrendDataPoint = {
  month?: string;
  economy_brl?: number;
  co2_tonnes?: number;
  compliance_rate_percent?: number;
  avg_fouling_mm?: number;
  avg_roughness_um?: number;
  monitored_vessels?: number;
  maintenance_events?: number;
};

type VisibleMetrics = {
  economy?: boolean;
  co2?: boolean;
  compliance?: boolean;
  fouling?: boolean;
  roughness?: boolean;
  vessels?: boolean;
  maintenance?: boolean;
};

interface TrendsChartProps {
  data: TrendDataPoint[];
  isLoading?: boolean;
  height?: number;
  width?: number;
  visibleMetrics?: VisibleMetrics;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

const COLORS = {
  economy: '#0066CC',
  co2: '#00A859',
  compliance: '#9C27B0',
  fouling: '#FF9800',
  roughness: '#F44336',
  vessels: '#2196F3',
  maintenance: '#795548'
};

export default function TrendsChart({ data, isLoading = false, height = 260, visibleMetrics }: TrendsChartProps) {
  const screenWidth = Dimensions.get('window').width - 48; // considerando padding do layout

  const safeVisible = {
    economy: visibleMetrics?.economy ?? true,
    co2: visibleMetrics?.co2 ?? true,
    compliance: visibleMetrics?.compliance ?? false,
    fouling: visibleMetrics?.fouling ?? false,
    roughness: visibleMetrics?.roughness ?? false,
    vessels: visibleMetrics?.vessels ?? false,
    maintenance: visibleMetrics?.maintenance ?? false
  };

  const chart = useMemo(() => {
    if (!data || data.length === 0) return null;

    // labels
    const labels = data.map((d) => d.month ?? '');

    // datasets: cada métrica vira um dataset opcional
    const datasets: { data: number[]; color?: (opacity: number) => string; strokeWidth?: number }[] = [];

    if (safeVisible.economy) {
      // converter BRL para milhões para visualização
      datasets.push({
        data: data.map((d) => (d.economy_brl ?? 0) / 1000000),
        color: () => COLORS.economy,
        strokeWidth: 2
      });
    }

    if (safeVisible.co2) {
      datasets.push({
        data: data.map((d) => d.co2_tonnes ?? 0),
        color: () => COLORS.co2,
        strokeWidth: 2
      });
    }

    if (safeVisible.compliance) {
      datasets.push({
        data: data.map((d) => d.compliance_rate_percent ?? 0),
        color: () => COLORS.compliance,
        strokeWidth: 2
      });
    }

    if (safeVisible.fouling) {
      datasets.push({
        data: data.map((d) => d.avg_fouling_mm ?? 0),
        color: () => COLORS.fouling,
        strokeWidth: 2
      });
    }

    if (safeVisible.roughness) {
      // ajustar escala para visualização
      datasets.push({
        data: data.map((d) => (d.avg_roughness_um ?? 0) / 100), // convertendo para mm (ex.)
        color: () => COLORS.roughness,
        strokeWidth: 2
      });
    }

    if (safeVisible.vessels) {
      datasets.push({
        data: data.map((d) => d.monitored_vessels ?? 0),
        color: () => COLORS.vessels,
        strokeWidth: 2
      });
    }

    if (safeVisible.maintenance) {
      datasets.push({
        data: data.map((d) => d.maintenance_events ?? 0),
        color: () => COLORS.maintenance,
        strokeWidth: 2
      });
    }

    return {
      labels,
      datasets
    };
  }, [data, safeVisible]);

  if (isLoading) {
    return (
      <View className="h-[260px] items-center justify-center">
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  if (!chart) {
    return (
      <View className="h-[260px] items-center justify-center">
        <Text className="text-gray-400">Nenhum dado disponível</Text>
      </View>
    );
  }

  // chartConfig básico; ajuste conforme tema
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(31,41,55, ${opacity})`, // cor dos eixos/tooltips
    labelColor: (opacity = 1) => `rgba(107,114,128, ${opacity})`,
    propsForDots: {
      r: '3',
      strokeWidth: '0',
      stroke: '#fff'
    },
    style: {
      borderRadius: 12
    }
  };

  // Montar prop datasets para chart-kit: aceita array de { data, color }
  const chartKitDatasets = chart.datasets.map((ds) => ({
    data: ds.data,
    color: ds.color,
    strokeWidth: ds.strokeWidth ?? 2
  }));

  return (
    // alinhamento à esquerda para ficar consistente com os chips
    <View className="rounded-xl self-center   overflow-hidden">
      <LineChart
        data={{
          labels: chart.labels,
          datasets: chartKitDatasets as any[]
        }}
        width={screenWidth}
        height={height}
        chartConfig={chartConfig}
        bezier
        withDots
        withShadow={false}
        withInnerLines={true}
        withOuterLines={false}
        style={{ borderRadius: 12 }}
        fromZero
      />

      {/* Legenda manual */}
      <View className="flex-row flex-wrap mt-3 px-4">
        {safeVisible.economy && (
          <View className="flex-row items-center mr-4 mb-2">
            <View style={{ width: 10, height: 10, backgroundColor: COLORS.economy, borderRadius: 2, marginRight: 6 }} />
            <Text className="text-xs text-gray-700">Economia (R$ M)</Text>
          </View>
        )}
        {safeVisible.co2 && (
          <View className="flex-row items-center mr-4 mb-2">
            <View style={{ width: 10, height: 10, backgroundColor: COLORS.co2, borderRadius: 2, marginRight: 6 }} />
            <Text className="text-xs text-gray-700">CO₂ (t)</Text>
          </View>
        )}
        {safeVisible.compliance && (
          <View className="flex-row items-center mr-4 mb-2">
            <View
              style={{ width: 10, height: 10, backgroundColor: COLORS.compliance, borderRadius: 2, marginRight: 6 }}
            />
            <Text className="text-xs text-gray-700">Conformidade (%)</Text>
          </View>
        )}
        {safeVisible.fouling && (
          <View className="flex-row items-center mr-4 mb-2">
            <View style={{ width: 10, height: 10, backgroundColor: COLORS.fouling, borderRadius: 2, marginRight: 6 }} />
            <Text className="text-xs text-gray-700">Bioincrustação (mm)</Text>
          </View>
        )}
        {safeVisible.roughness && (
          <View className="flex-row items-center mr-4 mb-2">
            <View
              style={{ width: 10, height: 10, backgroundColor: COLORS.roughness, borderRadius: 2, marginRight: 6 }}
            />
            <Text className="text-xs text-gray-700">Rugosidade (mm)</Text>
          </View>
        )}
        {safeVisible.vessels && (
          <View className="flex-row items-center mr-4 mb-2">
            <View style={{ width: 10, height: 10, backgroundColor: COLORS.vessels, borderRadius: 2, marginRight: 6 }} />
            <Text className="text-xs text-gray-700">Embarcações</Text>
          </View>
        )}
        {safeVisible.maintenance && (
          <View className="flex-row items-center mr-4 mb-2">
            <View
              style={{ width: 10, height: 10, backgroundColor: COLORS.maintenance, borderRadius: 2, marginRight: 6 }}
            />
            <Text className="text-xs text-gray-700">Eventos de Manutenção</Text>
          </View>
        )}
      </View>
    </View>
  );
}
