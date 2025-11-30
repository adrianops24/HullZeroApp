import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import SectionHeader from '~/src/components/dashboard/SectionHeader';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import TrendsChart from '~/src/components/TrendsChart';
import { useDashboardKPIs } from '~/src/lib/hooks/useDashboardKPIs';
import { useFleetStatus } from '~/src/lib/hooks/useFleetStatus';
import clsx from 'clsx';

export default function DashboardScreen() {
  console.log('🎯 DashboardScreen iniciando...');

  // COMENTADO: Hook potencialmente problemático
  const { kpis, isLoading: kpisLoading, isError: kpisError } = useDashboardKPIs();

  const { fleetStatus, isLoading: fleetLoading, isError: fleetError } = useFleetStatus();

  console.log('📊 Estado do fleetStatus:', {
    fleetLoading,
    fleetError,
    fleetStatusLength: fleetStatus.length
  });

  // COMENTADO: Uso do kpis que depende do hook comentado
  const kpisObj = useMemo(() => {
    if (!kpis) return null;
    if (Array.isArray(kpis)) {
      return {
        accumulated_economy_brl: (kpis[0] && (kpis[0].value ?? kpis[0].amount)) ?? 0,
        co2_reduction_tonnes: (kpis[1] && (kpis[1].value ?? kpis[1].amount)) ?? 0,
        compliance_rate_percent: (kpis[2] && (kpis[2].value ?? kpis[2].amount)) ?? 0,
        monitored_vessels: (kpis[3] && (kpis[3].value ?? kpis[3].amount)) ?? 0
      };
    }
    return kpis;
  }, [kpis]);

  const kpisListSafe = {
    accumulated_economy_brl: 0,
    co2_reduction_tonnes: 0,
    compliance_rate_percent: 95,
    monitored_vessels: 0
  };

  const fleetList = Array.isArray(fleetStatus) ? fleetStatus : [];

  const [period, setPeriod] = useState('6 Meses');

  const [visibleMetrics, setVisibleMetrics] = useState({
    economy: true,
    co2: true,
    compliance: true
  });

  const toggleMetric = (key: keyof typeof visibleMetrics) => {
    setVisibleMetrics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  function KPICard({ label, value, helpText }: { label: string; value: string | number; helpText?: string }) {
    return (
      <View style={{ width: '48%', marginBottom: 16 }}>
        <View
          style={{
            backgroundColor: '#092B5A',
            borderRadius: 12,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}
        >
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>{label}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 24, color: '#FFB800', marginTop: 8 }}>{value}</Text>
          {helpText && <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>{helpText}</Text>}
        </View>
      </View>
    );
  }

  const periods = ['1 Mês', '3 Meses', '6 Meses', '12 Meses'];

  const handlePeriodChange = (p: string) => setPeriod(p);

  // COMENTADO: Dados complexos do gráfico
  const sample = {
    economy: visibleMetrics.economy ? [0, 3, 7, 10, 13] : [],
    co2: visibleMetrics.co2 ? [0, 1, 2, 3, 4] : [],
    compliance: visibleMetrics.compliance ? [95, 94, 96, 95, 95] : []
  };

  const trendPoints = Array.from({ length: 5 }).map((_, i) => ({
    month: `M${i + 1}`,
    economy_brl: sample.economy[i] !== undefined ? sample.economy[i] * 1_000_000 : 0,
    co2_tonnes: sample.co2[i] ?? 0,
    compliance_rate_percent: sample.compliance[i] ?? 0
  }));

  const getAlertColors = (type: string) => {
    switch (type) {
      case 'critical':
        return { icon: '#DC2626', bg: 'bg-red-50', text: 'text-red-600' };
      case 'warning':
        return { icon: '#D97706', bg: 'bg-yellow-50', text: 'text-yellow-700' };
      case 'ok':
        return { icon: '#059669', bg: 'bg-green-50', text: 'text-green-600' };
      default:
        return { icon: '#6B7280', bg: 'bg-gray-50', text: 'text-gray-700' };
    }
  };

  // Função simplificada para clsx

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f3f4f6', paddingTop: 60, paddingHorizontal: 24 }}>
      {/* Header */}
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#092B5A' }}>Dashboard da Frota</Text>
          <Text style={{ color: '#092B5A', marginTop: 4, fontSize: 16 }}>
            Visão consolidada de todas as embarcações
          </Text>
        </View>

        <TouchableOpacity
          style={{
            padding: 8,
            borderRadius: 20,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2
          }}
        >
          <AntDesign name="ellipsis1" size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* KPIs */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 }}>
        {/* COMENTADO: Loading state do kpis */}
        {kpisLoading ? (
          <View style={{ width: '100%', alignItems: 'center', paddingVertical: 24 }}>
            <ActivityIndicator size="small" color="#0066CC" />
          </View>
        ) : kpisError ? (
          <View style={{ width: '100%', alignItems: 'center', paddingVertical: 24 }}>
            <Text style={{ color: 'red' }}>Erro ao carregar KPIs.</Text>
          </View>
        ) : (
          <>
            <KPICard
              label="Economia Acumulada"
              value={`R$ ${kpisListSafe.accumulated_economy_brl.toLocaleString('pt-BR')}`}
              helpText="Últimos 6 Meses"
            />

            <KPICard label="Redução de CO₂" value={`${kpisListSafe.co2_reduction_tonnes.toFixed(0)} t`} />

            <KPICard
              label="Taxa de Conformidade"
              value={`${kpisListSafe.compliance_rate_percent.toFixed(0)}%`}
              helpText="NORMAM 401"
            />

            <KPICard label="Embarcações" value={`${kpisListSafe.monitored_vessels}`} helpText="Monitoradas" />
          </>
        )}
      </View>

      {/* Divisor */}
      <View style={{ height: 1, backgroundColor: '#d1d5db', marginBottom: 24 }} />

      {/* Tendências - COMENTADO: Seção complexa */}

      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#092B5A' }}>Tendências</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          {periods.map((p) => {
            const selected = p === period;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => handlePeriodChange(p)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                  backgroundColor: selected ? '#092B5A' : '#e5e7eb'
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: selected ? 'white' : '#374151'
                  }}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4
          }}
        >
          <Text style={{ textAlign: 'center', color: '#6b7280', marginVertical: 40 }}>
            Gráfico de Tendências (Componente comentado)
          </Text>
          {/* COMENTADO: Componente complexo do gráfico */}
          <TrendsChart data={trendPoints} isLoading={false} height={200} visibleMetrics={visibleMetrics} />
        </View>
      </View>

      {/* Status da Frota */}
      <View style={{ marginBottom: 100 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#092B5A' }}>Status da Frota</Text>
        </View>

        {fleetLoading ? (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0066CC" />
          </View>
        ) : fleetError ? (
          <View style={{ paddingVertical: 16, alignItems: 'center' }}>
            <Text style={{ color: 'red' }}>Erro ao carregar status da frota.</Text>
          </View>
        ) : fleetList.length === 0 ? (
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#fef2f2',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MaterialIcons name="error-outline" size={20} color="#DC2626" />
              </View>
              <Text style={{ marginLeft: 12, color: '#dc2626' }}>Nenhuma embarcação encontrada.</Text>
            </View>
          </View>
        ) : (
          fleetList.map((item: any, index: number) => {
            const label = item.name ?? item.label ?? `Embarcação ${index + 1}`;
            const type = item.status ?? item.type ?? 'ok';
            const colors = getAlertColors(type);

            return (
              <View
                key={item.id ?? index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: type === 'critical' ? '#fef2f2' : type === 'warning' ? '#fffbeb' : '#f0fdf4'
                      }}
                    >
                      <MaterialIcons
                        name={type === 'critical' ? 'error' : type === 'warning' ? 'warning' : 'check-circle'}
                        size={18}
                        color={colors.icon}
                      />
                    </View>

                    <View style={{ marginLeft: 12 }}>
                      <Text
                        style={{
                          fontWeight: '600',
                          color: type === 'critical' ? '#dc2626' : type === 'warning' ? '#d97706' : '#059669'
                        }}
                      >
                        {label}
                      </Text>

                      <Text style={{ color: '#6b7280', fontSize: 12 }}>
                        {item.last_update
                          ? `Atualizado: ${new Date(item.last_update).toLocaleDateString('pt-BR')}`
                          : 'Status atualizado'}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: type === 'critical' ? '#dc2626' : type === 'warning' ? '#d97706' : '#059669'
                    }}
                  >
                    {type === 'critical' ? 'Crítico' : type === 'warning' ? 'Alerta' : 'Normal'}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}
