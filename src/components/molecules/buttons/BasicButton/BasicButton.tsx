import type { GenericButtonProps } from '../GenericButton/GenericButton';
import type { ColorTokens } from 'tamagui';

import { StyleSheet } from 'react-native';

import { GenericButton } from '../GenericButton';

const pressedBackgroundColor: ColorTokens = '$button-background-active-basic';
const inactiveBackgroundColor: ColorTokens =
  '$button-background-inactive-basic';

type BasicButtonProps = Omit<
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

const BasicButton = ({ children, disabled, ...props }: BasicButtonProps) => (
  <GenericButton
    {...props}
    disabled={disabled}
    backgroundColor={
      disabled ? inactiveBackgroundColor : '$button-background-default-basic'
    }
    pressStyle={disabled ? styles.inactivePress : styles.activePress}
    color={disabled ? '$text-inactive' : '$text-action'}
  >
    {children}
  </GenericButton>
);

export { BasicButton };
export type { BasicButtonProps };
