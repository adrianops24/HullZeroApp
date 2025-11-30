import React from 'react';
import { View, Text } from 'react-native';

interface SectionHeaderProps {
  title: string;
  period?: string;
}

export default function SectionHeader({ title, period }: SectionHeaderProps) {
  return (
    <View className="flex-row justify-between mt-6 mb-2">
      <Text className="text-[17px] font-bold text-[#222]">{title}</Text>

      {period && <Text className="bg-gray-200 px-3 py-1 rounded-lg text-[13px] text-[#444]">{period}</Text>}
    </View>
  );
}
