import { View } from 'react-native';
import LoadingSpinner from './LoadingSpinner';

export default function LoadingOverlay() {
  return (
    <View className="absolute inset-0 items-center justify-center bg-black/30 z-50">
      <LoadingSpinner color="#FAC03B" size="large" />
    </View>
  );
}
