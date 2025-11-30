import { Text } from 'react-native';
import { useDeviceSize } from '~/src/lib/hooks/useResponsiveValues';
import clsx from 'clsx';
const { isSmall, isMedium, isLarge } = useDeviceSize();
export const EssenciarTitle = () => {
  return (
    <Text
      maxFontSizeMultiplier={1}
      allowFontScaling={false}
      className={clsx(
        'font-worksans text-primario tracking-extra font-bold text-center  ',
        isSmall && 'text-3xl leading-snug',
        isMedium && 'text-5xl leading-tight',
        isLarge && 'text-5xl leading-tight'
      )}
    >
      ESSENCIAR
    </Text>
  );
};
