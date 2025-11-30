import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useDeviceSize } from '~/src/lib/hooks/useResponsiveValues';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { clsx } from 'clsx';
export default function BottomNavigation() {
  const router = useRouter();
  const { isSmall, isMedium, isLarge } = useDeviceSize();
  return (
    <View
      className="justify-center items-center"
      style={{
        // sombreamento cross-platform
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 }
      }}
    >
      <View
        className={clsx(
          'w-[85%] flex-row items-center justify-around bg-white rounded-tl-2xl rounded-tr-2xl px-5  ',
          isSmall && ' py-2 mt-7',
          isMedium && ' py-3',
          isLarge && 'py-4'
        )}
      >
        {/* Botão pill "Home" */}
        <TouchableOpacity
          className="flex-row items-center bg-amber-400 rounded-2xl px-3 "
          onPress={() => router.push('/(tabs)/home')}
          accessibilityRole="button"
          accessibilityLabel="Ir para Home"
        >
          <View className="bg-[amber-500] rounded-full p-1 ">
            <AntDesign name="home" size={16} color="#FFFFFF" />
          </View>
          <Text className="text-white font-semibold text-xs">Home</Text>
        </TouchableOpacity>

        {/* Ícone de chat à direita */}
        <TouchableOpacity
          className="w-10 h-10 rounded-xl items-center justify-center"
          onPress={() => router.push('/(screens)/messages')}
          accessibilityRole="button"
          accessibilityLabel="Mensagens"
        >
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#F59E0B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
