import { useColorTokenValue } from "@react-native-ui-config";
import type { Token, ColorTokens } from "tamagui";

import { View, getTokenValue } from "tamagui";

type CircleProps = {
  size: Token;
  thickness?: number;
  backgroundColor: ColorTokens;
  spinningPieceColor: ColorTokens;
};

const Circle = ({
  size,
  thickness,
  backgroundColor,
  spinningPieceColor,
}: CircleProps) => (
  <View
    style={{
      borderColor: useColorTokenValue(backgroundColor),
      borderTopColor: useColorTokenValue(spinningPieceColor),
      width: getTokenValue(size),
      height: getTokenValue(size),
      borderWidth: thickness,
      borderRadius: getTokenValue(size) / 2,
    }}
  />
);

export { Circle };
