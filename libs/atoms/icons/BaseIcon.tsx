import type { XmlProps } from "react-native-svg";
import type { ColorTokens } from "tamagui";

import { SvgXml } from "react-native-svg";

import { svgImports } from "./svg-imports";
import { getImageDimensions } from "@react-native-functions";
import { useFontScale } from "@react-native-hooks";
import { useColorTokenValue } from "@react-native-ui-config";

type IconName = keyof typeof svgImports;

type BaseIconProps = {
  iconName: IconName;
  color?: ColorTokens;
  width?: number;
  height?: number;
  autoScaleBasedOnScreenDimensions?: boolean;
  maxFontScaleToApply?: number;
  viewBox?: string;
} & Omit<XmlProps, "width" | "height" | "color" | "xml">;

const isIconValid = (nameOfIcon: string | IconName): nameOfIcon is IconName =>
  nameOfIcon in svgImports;

/**
 * Icon component that wraps the `react-native-svg`'s `SvgXml` component.
 * @param props Icon props
 * @param props.color ColorToken name from theme
 * @param props.iconName Icon name
 * @param props.width Icon width (ratio will be kept)
 * @param props.height Icon height (ratio will be kept)
 * @param props.viewBox Icon viewBox
 * @returns BaseIcon component
 */
const BaseIcon = ({
  color,
  iconName,
  width,
  height,
  preserveAspectRatio = "xMaxYMax meet",
  autoScaleBasedOnScreenDimensions = true,
  maxFontScaleToApply,
  viewBox = "0 0 24 24",
  ...rest
}: BaseIconProps) => {
  if (!isIconValid(iconName)) {
    throw new Error(`Icon ${iconName} does not exist`);
  }

  const fontScale = useFontScale();

  const { width: maybeScaledWidth, height: maybeScaledHeight } =
    getImageDimensions({
      width,
      height,
      autoScaleBasedOnScreenDimensions,
      defaultSize: 30,
      fontScale,
      maxFontScaleToApply,
    });

  const calculatedColor = useColorTokenValue(color);
  const svgXml = svgImports[iconName];

  return (
    <SvgXml
      width={maybeScaledWidth}
      height={maybeScaledHeight}
      color={calculatedColor}
      xml={svgXml}
      preserveAspectRatio={preserveAspectRatio}
      {...rest}
    />
  );
};

export { BaseIcon };
export type { IconName, BaseIconProps };
