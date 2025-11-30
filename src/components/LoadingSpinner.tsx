import { View, ActivityIndicator, ViewStyle, ActivityIndicatorProps } from 'react-native';

type LoadingSpinnerProps = Readonly<{
  color?: string;
  size?: ActivityIndicatorProps['size'];
  className?: string;
  style?: ViewStyle;
}>;

export default function LoadingSpinner({ color = '#ffffff', size = 'small', className, style }: LoadingSpinnerProps) {
  return (
    <View className={className} style={style}>
      <ActivityIndicator color={color} size={size} />
    </View>
  );
}

export { LoadingSpinnerProps };
