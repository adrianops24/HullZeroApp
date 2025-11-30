// screens/home/HomeScreen.tsx
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';

import BottomNavigation from '~/src/components/BottomNavigation';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { useDeviceSize } from '~/src/lib/hooks/useResponsiveValues';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Mid from '~/src/assets/Mid.svg';
import DossieSvg from '~/src/assets/dossieSvg.svg';
import PessoalSvg from '~/src/assets/pessoalSvg.svg';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '~/src/store/auth/authStore';

const { isSmall, isMedium, isLarge } = useDeviceSize();

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput | null>(null);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleSearchPress = () => {
    console.log('Ação de busca:', query);
    // aqui você pode navegar ou executar a busca real
    // ex: router.push({ pathname: '/(search)', params: { q: query } })
  };

  const handleLogoutPress = async () => {
    try {
      await logout();
      await router.replace('/screens/auth/login');
    } catch (error) {
      console.error('Erro ao fazer logout', error);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <View className="flex-1 bg-[#EEEEF3]">
      <View
        className={clsx(
          'font-montserrat font-extrabold text-[#1A1B41]',
          isSmall && 'px-3 pt-12 pb-4',
          isMedium && 'px-5 pt-14 pb-6',
          isLarge && 'px-6 pt-16 pb-8'
        )}
      >
        <View className="flex-row ">
          <View className="flex-1 ">
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <Text
                  className={clsx(
                    'font-montserrat font-extrabold text-[#1A1B41]',
                    isSmall && 'text-xl leading-snug',
                    isMedium && 'text-2xl leading-snug',
                    isLarge && 'text-3xl leading-tight'
                  )}
                >
                  Olá, {'Adriano'}!
                </Text>
                <MaterialCommunityIcons
                  className={clsx(isSmall && 'ml-1', isMedium && 'ml-2', isLarge && 'ml-3')}
                  name="hand-wave-outline"
                  size={isMedium ? 30 : isSmall ? 24 : 36}
                  color="#F59E0B"
                />
              </View>

              <TouchableOpacity
                onPress={handleLogoutPress}
                className={clsx(
                  'bg-[#FAC03B]  rounded-full shadow items-center justify-center',
                  isSmall && 'mt-1 w-10 h-10',
                  isMedium && ' w-12 h-12',
                  isLarge && 'mt-2 w-12 h-12'
                )}
                accessibilityRole="button"
                accessibilityLabel="Sair da conta"
              >
                <SimpleLineIcons
                  name="logout"
                  className="mr-2"
                  size={isMedium ? 24 : isSmall ? 20 : 28}
                  color="black"
                />
              </TouchableOpacity>
            </View>

            <View className={clsx('flex-row items-center', isSmall && 'pt-8', isMedium && 'pt-10', isLarge && 'pt-12')}>
              <Text
                className={clsx(
                  'font-montserrat text-[#1A1B41]',
                  isSmall && 'text-base leading-snug',
                  isMedium && 'text-lg leading-snug',
                  isLarge && 'text-xl leading-tight'
                )}
              >
                outono
              </Text>
              <FontAwesome
                className={clsx(isSmall && 'ml-1', isMedium && 'ml-2', isLarge && 'ml-3')}
                name="leaf"
                size={isMedium ? 18 : isSmall ? 14 : 22}
                color="#F59E0B"
              />
            </View>

            <View
              className={clsx(
                'bg-white rounded-xl shadow-sm flex-row items-center ',
                isSmall && 'mt-6 px-3',
                isMedium && 'mt-10 py-2 px-3',
                isLarge && 'mt-12 py-3 px-4'
              )}
            >
              <TextInput
                ref={inputRef}
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar Testes Personalizados"
                placeholderTextColor="#9CA3AF"
                returnKeyType="search"
                onSubmitEditing={handleSearchPress}
                className="flex-1"
              />

              {query.length > 0 ? (
                <TouchableOpacity onPress={handleClear}>
                  <MaterialIcons name="close" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleSearchPress}>
                  <MaterialIcons name="search" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>

      <ScrollView className={clsx('flex-1', isSmall && 'px-3 py-3', isMedium && 'px-6 pt-6', isLarge && 'px-8 pt-8')}>
        <View className={clsx('items-center', isSmall && 'mb-3', isMedium && 'mb-4', isLarge && 'mb-6')}>
          <Text
            className={clsx(
              'font-extrabold text-gray-800',
              isSmall && 'text-lg mb-2',
              isMedium && 'text-2xl mb-4',
              isLarge && 'text-2xl mb-5'
            )}
          >
            Testes personalizados
          </Text>
        </View>

        <View className={clsx('flex-row justify-between')}>
          <TouchableOpacity
            className={clsx(
              'bg-[#FAC03B] rounded-2xl shadow-sm w-[30%]',
              isSmall && 'h-[120px]',
              isMedium && 'h-[200px]',
              isLarge && 'h-[200px]'
            )}
            onPress={async () => {
              console.log('Navegar para a tela Corporal');
              try {
                await router.push('/screens/testsBody/body');
                console.log('Navegou com sucesso para a tela Corporal');
              } catch (error) {
                console.error('Erro ao navegar para a tela Corporal', error);
              }
            }}
          >
            <View
              className={clsx(
                'w-full items-center justify-center',
                isSmall && 'mt-2',
                isMedium && 'mt-4',
                isLarge && 'mt-6'
              )}
            >
              <Mid width={isSmall ? 80 : isMedium ? 100 : 120} height={isSmall ? 80 : isMedium ? 100 : 120} />
              <Text
                className={clsx(
                  'text-black font-bold text-center',
                  isSmall && 'text-sm pt-2',
                  isMedium && 'text-lg pt-3',
                  isLarge && 'text-xl pt-4'
                )}
              >
                Corporal
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={clsx(
              'bg-[#FAC03B] rounded-2xl shadow-sm w-[30%]',
              isSmall && 'h-[120px]',
              isMedium && 'h-[200px]',
              isLarge && 'h-[200px]'
            )}
            onPress={async () => {
              console.log('Navegar para a tela Corporal');
              try {
                await router.push('/screens/testsBody');
                console.log('Navegou com sucesso para a tela Corporal');
              } catch (error) {
                console.error('Erro ao navegar para a tela Corporal', error);
              }
            }}
          >
            <View
              className={clsx(
                'w-full items-center justify-center',
                isSmall && 'mt-2',
                isMedium && 'mt-4',
                isLarge && 'mt-6'
              )}
            >
              <PessoalSvg width={isSmall ? 80 : isMedium ? 100 : 120} height={isSmall ? 80 : isMedium ? 100 : 120} />
              <Text
                className={clsx(
                  'text-black font-bold text-center',
                  isSmall && 'text-sm pt-2',
                  isMedium && 'text-lg pt-3',
                  isLarge && 'text-xl pt-4'
                )}
              >
                Pessoal
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={clsx(
              'bg-[#FAC03B] rounded-2xl shadow-sm w-[30%]',
              isSmall && 'h-[120px]',
              isMedium && 'h-[200px]',
              isLarge && 'h-[200px]'
            )}
          >
            <View
              className={clsx(
                'w-full items-center justify-center',
                isSmall && 'mt-2',
                isMedium && 'mt-4',
                isLarge && 'mt-6'
              )}
            >
              <DossieSvg width={isSmall ? 80 : isMedium ? 100 : 120} height={isSmall ? 80 : isMedium ? 100 : 120} />
              <Text
                className={clsx(
                  'text-black font-bold text-center',
                  isSmall && 'text-sm pt-2',
                  isMedium && 'text-lg pt-3',
                  isLarge && 'text-xl pt-4'
                )}
              >
                Dossiê
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Ver mais */}
        <View className={clsx('items-end', isSmall && 'mt-8 mb-4', isMedium && 'mt-10 mb-6', isLarge && 'mt-12 mb-8')}>
          <TouchableOpacity className="items-center flex-row">
            <Text className="text-sm text-[#CFCFCF]">ver mais</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#CFCFCF" />
          </TouchableOpacity>
        </View>

        <View className={clsx('items-center', isSmall && 'mb-3', isMedium && 'mb-4', isLarge && 'mb-6')}>
          <Text
            className={clsx(
              'font-extrabold text-gray-800',
              isSmall && 'text-lg mb-3',
              isMedium && 'text-2xl mb-4',
              isLarge && 'text-2xl mb-5'
            )}
          >
            Recomendações Personalizadas
          </Text>
        </View>

        <View className={clsx(isSmall && 'mb-4', isMedium && 'mb-6', isLarge && 'mb-8')}>
          <View
            className={clsx(
              'flex-row items-center justify-between',
              isSmall && 'space-x-2',
              isMedium && 'space-x-3',
              isLarge && 'space-x-4'
            )}
          >
            <TouchableOpacity
              className={clsx(
                'flex-row items-center bg-white rounded-xl shadow-sm w-[48%]',
                isSmall && 'px-3 py-2',
                isMedium && 'px-4 py-3',
                isLarge && 'px-5 py-4'
              )}
            >
              <View
                className={clsx(
                  'bg-[#F59E0B] rounded-full',
                  isSmall && 'p-1.5 mr-2',
                  isMedium && 'p-2 mr-3',
                  isLarge && 'p-2.5 mr-4'
                )}
              >
                <Ionicons name="color-palette-outline" size={isSmall ? 14 : isMedium ? 16 : 18} color="white" />
              </View>
              <Text
                className={clsx(
                  'text-gray-700 font-worksans',
                  isSmall && 'text-xs',
                  isMedium && 'text-sm',
                  isLarge && 'text-base'
                )}
              >
                Cores Estação
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={clsx(
                'flex-row items-center bg-white rounded-xl shadow-sm w-[48%]',
                isSmall && 'px-3 py-2',
                isMedium && 'px-4 py-3',
                isLarge && 'px-5 py-4'
              )}
            >
              <View
                className={clsx(
                  'bg-[#F59E0B] rounded-full',
                  isSmall && 'p-1.5 mr-2',
                  isMedium && 'p-2 mr-3',
                  isLarge && 'p-2.5 mr-4'
                )}
              >
                <Ionicons name="shirt-outline" size={isSmall ? 14 : isMedium ? 16 : 18} color="white" />
              </View>
              <Text
                className={clsx(
                  'text-gray-700 font-medium',
                  isSmall && 'text-xs',
                  isMedium && 'text-sm',
                  isLarge && 'text-base'
                )}
              >
                Peças Chave
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className={clsx('items-end', isSmall && 'mt-6 mb-3', isMedium && 'mt-10 mb-4', isLarge && 'mt-12 mb-5')}
          >
            <TouchableOpacity className="items-center flex-row">
              <Text className="text-sm text-[#CFCFCF]">ver mais</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#CFCFCF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}
