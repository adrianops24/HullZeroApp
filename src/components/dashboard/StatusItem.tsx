import { View, Text } from 'react-native';

type Props = {
  label: string;
  type: 'ok' | 'warning' | 'critical' | 'empty';
};

export default function StatusItem({ label, type }: Props) {
  return (
    <View className="w-full bg-white p-4 rounded-xl mt-3 shadow">
      <Text className="text-[14px] font-medium text-[#444]">{label}</Text>
    </View>
  );
}
