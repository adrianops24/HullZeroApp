import { View, Text, TouchableOpacity } from 'react-native';
import { clsx } from 'clsx';
import { useDeviceSize } from '~/src/lib/hooks/useResponsiveValues';
import BottomNavigation from '~/src/components/BottomNavigation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
export default function RecommendationsOnly() {
  const { isSmall, isMedium, isLarge } = useDeviceSize();

  return (
    <View className="flex-1 bg-[rgb(238,238,243)] ">
      <View
        className={clsx('flex-row items-center px-6', isSmall && 'pt-6 ', isMedium && 'pt-20 ', isLarge && 'pt-20 ')}
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

      <View
        className={clsx(
          'flex-1 px-6 items-center justify-center',
          isSmall && 'pt-0',
          isMedium && 'pt-0',
          isLarge && 'pt-0'
        )}
      >
        <Text
          className={clsx(
            'font-extrabold text-gray-800 text-center mb-4',
            isSmall && 'text-lg',
            isMedium && 'text-4xl',
            isLarge && 'text-4xl'
          )}
        >
          Teste de Estilo
        </Text>
        <Text
          className={clsx(
            'text-gray-600 mb-20 text-center',
            isSmall && 'text-sm',
            isMedium && 'text-base',
            isLarge && 'text-lg'
          )}
        >
          Descubra seu estilo predominante respondendo às perguntas abaixo.
        </Text>

        <View
          className={clsx(
            'w-full flex-row justify-center',
            isSmall && 'gap-2',
            isMedium && 'gap-3',
            isLarge && 'gap-4'
          )}
        >
          <TouchableOpacity
            className={clsx(
              'flex-row items-center justify-center bg-[#FAC03B] rounded-xl shadow-sm',
              isSmall && 'w-[48%] px-3 py-2',
              isMedium && 'w-[48%] px-4 py-3',
              isLarge && 'w-[48%] px-5 py-4'
            )}
          >
            <Text
              className={clsx(
                'text-white font-medium',
                isSmall && 'text-xs',
                isMedium && 'text-lg',
                isLarge && 'text-base'
              )}
            >
              Testes femininos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={clsx(
              'flex-row items-center justify-center bg-[#FAC03B] rounded-xl shadow-sm',
              isSmall && 'w-[52%] px-3 py-2',
              isMedium && 'w-[48%] px-4 py-3',
              isLarge && 'w-[48%] px-5 py-4'
            )}
            onPress={async () => {
              console.log('Navegar para a tela Corporal');
              try {
                await router.push('/screens/testsBody/maMapper');
                console.log('Navegou com sucesso para a tela Corporal');
              } catch (error) {
                console.error('Erro ao navegar para a tela Corporal', error);
              }
            }}
          >
            <Text
              className={clsx(
                'text-white font-medium',
                isSmall && 'text-xs',
                isMedium && 'text-lg',
                isLarge && 'text-base'
              )}
            >
              Testes masculinos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomNavigation />
    </View>
  );
}
