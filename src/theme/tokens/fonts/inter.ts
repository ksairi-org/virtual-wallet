import { scaleBasedOnScreenDimension } from "@react-native-functions";
import { createFontObject } from "@react-native-ui-config";
import { createFont } from "tamagui";

const size = createFontObject(
  [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 80, 80].map((value) =>
    scaleBasedOnScreenDimension(value),
  ),
);

const lineHeight = createFontObject(
  [16, 18, 20, 22, 24, 28, 32, 38, 40, 44, 56, 72, 88].map((value) =>
    scaleBasedOnScreenDimension(value),
  ),
);

const letterSpacing = createFontObject(
  [
    -1.2000000476837158, -0.6000000238418579, -0.3499999940395355,
    -0.30000001192092896, -0.15000000596046448, -0.10000000149011612, 0, 0, 0,
    0, 0, 0, 0,
  ].map((value) => scaleBasedOnScreenDimension(value)),
);

const weight = createFontObject([
  400, 600, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700,
]);

const inter = createFont({
  family: "Inter, var(--font-inter)",
  size,
  lineHeight,
  weight,
  letterSpacing,
  face: {
    "400": { normal: "Inter-Regular" },
    "600": { normal: "Inter-SemiBold" },
    "700": { normal: "Inter-Bold" },
  },
});

export { inter };
