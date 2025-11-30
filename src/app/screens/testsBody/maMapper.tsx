import { View, Text, TouchableOpacity } from 'react-native';
import { clsx } from 'clsx';
import { useDeviceSize } from '~/src/lib/hooks/useResponsiveValues';
import BottomNavigation from '~/src/components/BottomNavigation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import mockData from '~/src/mocks/typesStylesTests';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type SizeKey = 'sm' | 'md' | 'lg';

function OptionItem({
  text,
  onPress,
  disabled,
  isSelected,
  size
}: {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  isSelected: boolean;
  size: SizeKey;
}) {
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: 180 });
  }, [isSelected]);

  // Anima somente a barra inferior (formato conforme a imagem)
  const bottomBarStyle = useAnimatedStyle(() => {
    return {
      height: progress.value * 3, // 0 -> 8 (aparece só quando selecionado)
      backgroundColor: '#FAC03B',
      borderBottomLeftRadius: 12
    };
  });

  // Barra lateral direita animada

  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg';

  return (
    <TouchableOpacity disabled={!!disabled} onPress={onPress} activeOpacity={0.9}>
      <View className={clsx('rounded-xl overflow-hidden bg-white shadow-sm relative', disabled && 'opacity-60')}>
        {/* Barra lateral direita */}
        <Animated.View className="absolute top-0 bottom-0 right-0" />
        <View className={clsx('px-4 py-3')}>
          <Text className={clsx('text-gray-800 text-center', textSize)} numberOfLines={3}>
            {text}
          </Text>
        </View>
        {/* Barra inferior animada */}
        <Animated.View className="w-full" style={bottomBarStyle} />
      </View>
    </TouchableOpacity>
  );
}
import { ScrollView } from 'react-native-gesture-handler';

export default function RecommendationsOnly() {
  const { isSmall, isMedium, isLarge } = useDeviceSize();
  const data = useMemo(() => mockData.sort((a, b) => a.displayOrder - b.displayOrder), []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Record<number, number[]>>({}); // questionIndex -> [optionIndexes]

  const current = data[activeIndex];
  const stringConvert: Record<string | number, string> = {
    1: 'uma',
    2: 'duas',
    3: 'três',
    4: 'quatro',
    5: 'cinco',
    6: 'seis'
  };

  const stringSelections = stringConvert[current.maxSelections];
  const optionsSelected = stringSelections === 'uma' ? 'opção' : 'opções';

  const toggleOption = (qIdx: number, optIdx: number) => {
    const max = Number(data[qIdx]?.maxSelections ?? 1);

    setSelected((prev) => {
      const curr = prev[qIdx] ?? [];
      const isSelected = curr.includes(optIdx);
      if (isSelected) {
        return { ...prev, [qIdx]: curr.filter((i) => i !== optIdx) };
      }
      if (curr.length >= max) {
        return prev;
      }
      return { ...prev, [qIdx]: [...curr, optIdx] };
    });
  };

  return (
    <View className="flex-1 bg-[rgb(238,238,243)] ">
      {activeIndex === 0 && (
        <View
          className={clsx(
            'flex-row items-center px-6',
            isSmall && 'pt-8 pb-9',
            isMedium && 'pt-20 ',
            isLarge && 'pt-20 '
          )}
        >
          <TouchableOpacity
            className="flex-row"
            onPress={async () => {
              try {
                await router.back();
              } catch (error) {
                console.error('Erro ao navegar para voltar a tela home', error);
              }
            }}
          >
            <MaterialIcons name="arrow-back-ios-new" size={isSmall ? 15 : isMedium ? 24 : 30} color="gray" />
            <Text
              className={clsx(
                'ml-2 font-medium text-gray-500',
                isSmall && 'text-xs',
                isMedium && 'text-base',
                isLarge && 'text-lg'
              )}
            >
              Voltar
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          className={clsx(
            'flex-1 px-6 items-center justify-center',
            isSmall && 'pt-0',
            isMedium && 'pt-0',
            isLarge && 'pt-0'
          )}
        >
          {current && (
            <View className={clsx('w-full', isSmall ? 'gap-3' : 'gap-4')}>
              <Text
                className={clsx(
                  'font-bold text-gray-900 text-center',
                  isSmall && 'text-lg mb-5',
                  isMedium && 'text-3xl mb-9',
                  isLarge && 'text-4xl'
                )}
              >
                {current.title}
              </Text>

              {/* Indicador de páginas */}

              {/* Opções */}
              <View className={clsx('w-full', isSmall ? 'gap-2' : 'gap-3')}>
                {current.questions
                  .slice()
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((opt, idx) => {
                    const isSelected = (selected[activeIndex] ?? []).includes(idx);
                    const isDisabled =
                      !isSelected && (selected[activeIndex]?.length ?? 0) >= Number(current.maxSelections ?? 1);
                    const size: SizeKey = isSmall ? 'sm' : isMedium ? 'md' : 'lg';
                    return (
                      <OptionItem
                        key={`${current.displayOrder}-${idx}`}
                        text={opt.text}
                        disabled={isDisabled}
                        isSelected={isSelected}
                        onPress={() => toggleOption(activeIndex, idx)}
                        size={size}
                      />
                    );
                  })}
              </View>

              <View className={clsx('self-center ', isSmall && 'gap-2', isMedium && 'gap-3', isLarge && 'gap-4')}>
                <Text
                  className={clsx(
                    'text-[#90909E]',
                    isSmall && 'text-sm',
                    isMedium && 'text-base',
                    isLarge && 'text-lg'
                  )}
                >
                  Escolha até {stringSelections} {optionsSelected}.
                </Text>
              </View>

              {/* Botão próximo/finalizar */}

              <View
                className={clsx(
                  'w-[45%] self-center flex-row items-center justify-between  mt-2',
                  isSmall && 'gap-2',
                  isMedium && 'gap-3 ',
                  isLarge && 'gap-4'
                )}
              >
                {activeIndex >= 1 && (
                  <TouchableOpacity onPress={() => setActiveIndex((i) => Math.max(0, i - 1))}>
                    <View
                      className={clsx(
                        '  bg-[#FAC03B] rounded-2xl flex items-center justify-around',
                        isSmall && 'w-7 h-7',
                        isMedium && 'w-10 h-10',
                        isLarge && 'w-12 h-12'
                      )}
                    >
                      <MaterialIcons
                        name="keyboard-arrow-left"
                        size={isSmall ? 20 : isMedium ? 30 : 40}
                        color="white"
                      />
                    </View>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  className={clsx(
                    'flex-row items-center justify-center bg-[#FAC03B] rounded-xl  flex-1',
                    isSmall && 'px-3 py-2 w-[10%]',
                    isMedium && 'px-4 py-3 w-[10%]',
                    isLarge && 'px-5 py-4'
                  )}
                  onPress={() => {
                    if (activeIndex < data.length - 1) {
                      setActiveIndex((i) => i + 1);
                    } else {
                      console.log('Respostas selecionadas:', selected);
                    }
                  }}
                  disabled={(selected[activeIndex]?.length ?? 0) < 1}
                >
                  <Text
                    className={clsx(
                      'text-white font-medium text-center',
                      isSmall && 'text-xs',
                      isMedium && 'text-lg',
                      isLarge && 'text-base'
                    )}
                  >
                    {activeIndex < data.length - 1 ? 'Próximo' : 'Finalizar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
}
