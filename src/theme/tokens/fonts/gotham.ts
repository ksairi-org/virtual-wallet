import { scaleBasedOnScreenDimension } from "@react-native-functions";
import { createFontObject } from "@react-native-ui-config";
import { createFont } from "tamagui";

const size = createFontObject(
  [10, 12, 15, 18, 24, 32, 40, 64].map((value) =>
    scaleBasedOnScreenDimension(value),
  ),
);

const lineHeight = createFontObject(
  [
    11, 13.200000762939453, 16.5, 19.80000114440918, 26.400001525878906,
    35.20000076293945, 44, 70.4000015258789,
  ].map((value) => scaleBasedOnScreenDimension(value)),
);

const letterSpacing = createFontObject(
  [0, 0, 0, 0, 0, 0, 0, 0].map((value) => scaleBasedOnScreenDimension(value)),
);

const weight = createFontObject([400, 500, 700, 700, 700, 700, 700, 700]);

const gotham = createFont({
  family: "Gotham, var(--font-gotham)",
  size,
  lineHeight,
  weight,
  letterSpacing,
  face: {
    "400": { normal: "Gotham-Regular" },
    "500": { normal: "Gotham-Medium" },
    "700": { normal: "Gotham-Bold" },
  },
});

export { gotham };
