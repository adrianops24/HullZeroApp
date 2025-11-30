import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  useDerivedValue,
  interpolateColor
} from 'react-native-reanimated';

const Dot = ({ isActive }: { isActive: boolean }) => {
  const progress = useDerivedValue(() => {
    return withSpring(isActive ? 1 : 0, { damping: 15, stiffness: 90 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(progress.value, [0, 1], [15, 35]);

    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(250, 192, 59, 0.5)', 'rgba(250, 192, 59, 1)']
    );

    return {
      width,
      backgroundColor
    };
  });

  return <Animated.View className="h-[15px] rounded-full mx-[8px]" style={animatedStyle} />;
};

interface PaginationIndicatorProps {
  totalPages: number;
  activeIndex: number;
}

export default function PaginationIndicatorComponent({ totalPages, activeIndex }: PaginationIndicatorProps) {
  return (
    <View className="h-[30px] flex-row justify-center items-center self-start left-4 bottom-4">
      {[...Array(totalPages)].map((_, index) => (
        <Dot key={index} isActive={index === activeIndex} />
      ))}
    </View>
  );
}
