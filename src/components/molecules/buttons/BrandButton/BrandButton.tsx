import type { GenericButtonProps } from '../GenericButton/GenericButton';
import type { ColorTokens } from 'tamagui';

import { StyleSheet } from 'react-native';

import { GenericButton } from '../GenericButton';

const pressedBackgroundColor: ColorTokens = '$button-background-active-brand';
const inactiveBackgroundColor: ColorTokens =
  '$button-background-inactive-brand';

type BrandButtonProps = Omit<
  GenericButtonProps,
  'backgroundColor' | 'pressStyle' | 'color'
>;

const styles = StyleSheet.create({
  inactivePress: {
    backgroundColor: inactiveBackgroundColor,
  },
  activePress: {
    backgroundColor: pressedBackgroundColor,
  },
});

const BrandButton = ({ children, disabled, ...props }: BrandButtonProps) => (
  <GenericButton
    {...props}
    disabled={disabled}
    backgroundColor={
      disabled ? inactiveBackgroundColor : '$button-background-default-brand'
    }
    pressStyle={disabled ? styles.inactivePress : styles.activePress}
    color={disabled ? '$text-inactive' : '$text-action'}
  >
    {children}
  </GenericButton>
);

export { BrandButton };
export type { BrandButtonProps };
