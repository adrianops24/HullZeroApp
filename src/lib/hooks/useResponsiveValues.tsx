import { Dimensions } from 'react-native';

export const useDeviceSize = () => {
  const width = Dimensions.get('window').width;
  console.log('Device width:', width);
  return {
    isSmall: width <= 360,
    isMedium: width > 360 && width <= 420,
    isLarge: width > 420
  };
};
