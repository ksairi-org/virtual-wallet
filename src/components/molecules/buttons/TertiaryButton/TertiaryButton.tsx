import { getTokenValue } from "tamagui";

import { AnimatedButton } from "../AnimatedButton";
import { BodyBoldLg } from "@fonts";

type TertiaryButtonProps = {
  text: string;
  width?: number;
  onPress?: () => void;
};

const TertiaryButton = ({
  text,
  width = 300,
  onPress,
}: TertiaryButtonProps) => (
  <AnimatedButton
    backgroundColor={"$surface-secondary"}
    width={width}
    height={getTokenValue("$2xl")}
    onPress={onPress}
  >
    <BodyBoldLg color={"$surface-invert"}>{text}</BodyBoldLg>
  </AnimatedButton>
);

export { TertiaryButton };
export type { TertiaryButtonProps };
