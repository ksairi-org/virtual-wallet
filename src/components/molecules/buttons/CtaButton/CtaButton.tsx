import type { GenericButtonProps } from "../GenericButton/GenericButton";
import type { ColorTokens } from "tamagui";

import { ActivityIndicator, StyleSheet } from "react-native";

import { GenericButton } from "../GenericButton";

const pressedBackgroundColor: ColorTokens = "$button-background-active-cta";
const inactiveBackgroundColor: ColorTokens = "$button-background-inactive-cta";

type CtaButtonProps = Omit<
  GenericButtonProps,
  "backgroundColor" | "pressStyle" | "color"
> & { loading?: boolean };

const styles = StyleSheet.create({
  inactivePress: {
    backgroundColor: inactiveBackgroundColor,
  },
  activePress: {
    backgroundColor: pressedBackgroundColor,
  },
});

const CtaButton = ({
  children,
  disabled,
  loading,
  ...props
}: CtaButtonProps) => (
  <GenericButton
    {...props}
    disabled={disabled}
    backgroundColor={
      disabled ? inactiveBackgroundColor : "$button-background-default-cta"
    }
    pressStyle={disabled ? styles.inactivePress : styles.activePress}
    color={disabled ? "$text-inactive" : "$text-action"}
  >
    {loading ? <ActivityIndicator size={"small"} /> : children}
  </GenericButton>
);

export { CtaButton };
export type { CtaButtonProps };
