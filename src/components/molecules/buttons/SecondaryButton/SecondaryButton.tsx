import { getTokenValue } from "tamagui";

import { AnimatedButton } from "../AnimatedButton";
import { BodyBoldLg } from "@fonts";

type SecondaryButtonProps = {
  text: string;
  width?: number;
  onPress?: () => void;
  loading?: boolean;
};

const SecondaryButton = ({
  text,
  width = 300,
  onPress,
  loading,
}: SecondaryButtonProps) => (
  <AnimatedButton
    width={width}
    height={getTokenValue("$2xl")}
    backgroundColor={"$surface-primary"}
    onPress={onPress}
    loading={loading}
  >
    <BodyBoldLg color={"$surface-invert"}>{text}</BodyBoldLg>
  </AnimatedButton>
);

export { SecondaryButton };
export type { SecondaryButtonProps };
