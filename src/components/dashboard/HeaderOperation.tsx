import React from 'react';
import { View, Text } from 'react-native';

interface HeaderOperationProps {
  title: string;
  subtitle: string;
}

export default function HeaderOperation({ title, subtitle }: HeaderOperationProps) {
  return (
    <View className="mt-5 pt-10 pb-4">
      <Text className="text-3xl font-extrabold text-black">{title}</Text>
      <Text className="text-[13px] text-Petrobras">{subtitle}</Text>
    </View>
  );
}
