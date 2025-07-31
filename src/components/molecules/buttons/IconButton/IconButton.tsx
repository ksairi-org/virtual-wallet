import type { ColorTokens, ButtonProps } from "tamagui";

import { useMemo } from "react";

import { Button } from "tamagui";
import { BaseIcon, BaseIconProps } from "@icons";

type ButtonType = "basic" | "cta" | "brand";

type IconColorType = {
  [key in ButtonType]: ColorTokens;
};

const iconColorTypes: IconColorType = {
  basic: "$text-action-inverse",
  cta: "$text-action-inverse",
  brand: "$text-action-inverse",
};

type IconButtonProps = Omit<
  ButtonProps,
  "unstyled" | "alignItems" | "textAlign" | "fontWeight"
> & {
  buttonType: ButtonType;
  height?: number;
  width?: number;
  iconColor?: ColorTokens;
} & Pick<BaseIconProps, "iconName" | "maxFontScaleToApply">;

type ButtonColorScheme = {
  default: ColorTokens;
  active: ColorTokens;
  inactive: ColorTokens;
  iconColor: ColorTokens;
};

/**
 * Icon button
 * @param props button props
 * @param props.buttonType button type
 * @param props.iconName name of Icon
 * @param props.iconColor Icon color
 * @param props.height Icon height
 * @param props.width Icon color
 * @param props.disabled is button disabled
 * @param props.type Icon Button Type: default | cta | brand | others
 * @returns IconButton component
 */
const IconButton = ({
  buttonType = "basic",
  disabled,
  iconColor,
  height = 24,
  width = 24,
  maxFontScaleToApply,
  iconName,
  ...props
}: IconButtonProps) => {
  const buttonColors = useMemo<ButtonColorScheme>(
    () => ({
      default: `$button-background-default-${buttonType}`,
      active: `$button-background-active-${buttonType}`,
      inactive: `$button-background-inactive-${buttonType}`,
      iconColor: iconColorTypes[buttonType],
    }),
    [buttonType],
  );

  return (
    <Button
      unstyled={true}
      borderRadius={"$full"}
      backgroundColor={buttonColors.default}
      padding={"$sm"}
      pressStyle={{
        backgroundColor: disabled ? buttonColors.inactive : buttonColors.active,
      }}
      {...props}
      disabled={disabled}
    >
      <BaseIcon
        height={height}
        width={width}
        iconName={iconName}
        color={
          disabled ? "$text-inactive" : iconColor || buttonColors.iconColor
        }
        maxFontScaleToApply={maxFontScaleToApply}
      />
    </Button>
  );
};

export { IconButton };
export type { IconButtonProps, ButtonType, IconColorType };
