import { getTokenValue } from "tamagui";

import { AnimatedButton } from "../AnimatedButton";
import { BodyBoldLg } from "@fonts";

type PrimaryButtonProps = {
  text: string;
  width?: number;
  opacity?: number;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

const PrimaryButton = ({
  text,
  width = 300,
  opacity,
  loading,
  disabled,
  onPress,
}: PrimaryButtonProps) => (
  <AnimatedButton
    width={width}
    height={getTokenValue("$2xl")}
    backgroundColor={"$surface-invert"}
    loading={loading}
    disabled={disabled}
    opacity={opacity}
    onPress={onPress}
  >
    <BodyBoldLg color={"$surface-app"}>{text}</BodyBoldLg>
  </AnimatedButton>
);

export { PrimaryButton };
export type { PrimaryButtonProps };
