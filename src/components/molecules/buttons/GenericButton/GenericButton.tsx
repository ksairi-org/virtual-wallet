import { BaseIcon, BaseIconProps } from "@icons";
import { useCallback, useState } from "react";

import type { LayoutChangeEvent } from "react-native";

import { Button, type ButtonProps, Spacer, YStack } from "tamagui";

type GenericButtonProps = Omit<
  ButtonProps,
  "unstyled" | "alignItems" | "textAlign"
> & {
  leftIconProps?: BaseIconProps;
  rightIconProps?: BaseIconProps;
};

const ButtonWithoutIcons = ({ children, ...props }: GenericButtonProps) => (
  <Button {...props} unstyled={true} alignItems={"center"}>
    {children}
  </Button>
);

const ButtonWithLeftIcon = ({
  children,
  leftIconProps,
  ...props
}: GenericButtonProps &
  Required<Pick<GenericButtonProps, "leftIconProps">>) => {
  const [spacerWidth, setSpacerWidth] = useState(0);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) =>
      setSpacerWidth(event.nativeEvent.layout.width),
    [],
  );

  return (
    <Button
      {...props}
      unstyled={true}
      alignItems={"center"}
      flexDirection={"row"}
    >
      <YStack padding={"$button-lg"} onLayout={onLayout}>
        <BaseIcon {...leftIconProps} />
      </YStack>

      <YStack flex={1} alignItems={"center"}>
        {children}
      </YStack>

      <Spacer width={spacerWidth} />
    </Button>
  );
};

const ButtonWithRightIcon = ({
  children,
  rightIconProps,
  ...props
}: GenericButtonProps &
  Required<Pick<GenericButtonProps, "rightIconProps">>) => {
  const [spacerWidth, setSpacerWidth] = useState(0);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) =>
      setSpacerWidth(event.nativeEvent.layout.width),
    [],
  );

  return (
    <Button
      {...props}
      unstyled={true}
      alignItems={"center"}
      flexDirection={"row"}
    >
      <Spacer width={spacerWidth} />
      <YStack flex={1} alignItems={"center"}>
        {children}
      </YStack>
      <YStack padding={"$button-lg"} onLayout={onLayout}>
        <BaseIcon {...rightIconProps} />
      </YStack>
    </Button>
  );
};

const ButtonWithTwoIcons = ({
  children,
  rightIconProps,
  leftIconProps,
  ...props
}: GenericButtonProps &
  Required<Pick<GenericButtonProps, "leftIconProps" | "rightIconProps">>) => (
  <Button
    {...props}
    unstyled={true}
    alignItems={"center"}
    flexDirection={"row"}
  >
    <YStack padding={"$button-lg"}>
      <BaseIcon {...leftIconProps} />
    </YStack>
    <YStack flex={1} alignItems={"center"}>
      {children}
    </YStack>
    <YStack padding={"$button-lg"}>
      <BaseIcon {...rightIconProps} />
    </YStack>
  </Button>
);

/**
 * Generic button with basic style + left & right Icons
 * @param props button props
 * @param props.children what to show within the button
 * @param props.leftIconProps left icon props
 * @param props.rightIconProps right icon props
 * @param props.borderRadius button border radius

 * @returns GenericButton component
 */
const GenericButton = ({
  children,
  leftIconProps,
  rightIconProps,
  ...props
}: GenericButtonProps) => {
  if (leftIconProps && rightIconProps) {
    return (
      <ButtonWithTwoIcons
        {...props}
        leftIconProps={leftIconProps}
        rightIconProps={rightIconProps}
      >
        {children}
      </ButtonWithTwoIcons>
    );
  }

  if (leftIconProps && !rightIconProps) {
    return (
      <ButtonWithLeftIcon {...props} leftIconProps={leftIconProps}>
        {children}
      </ButtonWithLeftIcon>
    );
  }

  if (rightIconProps && !leftIconProps) {
    return (
      <ButtonWithRightIcon {...props} rightIconProps={rightIconProps}>
        {children}
      </ButtonWithRightIcon>
    );
  }

  return <ButtonWithoutIcons {...props}>{children}</ButtonWithoutIcons>;
};

export type { GenericButtonProps };
export { GenericButton };
