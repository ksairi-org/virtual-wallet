import type { GetProps, TamaguiElement } from "tamagui";

import { forwardRef } from "react";

import { styled, ThemeableStack } from "tamagui";
import { useAutoHitSlop } from "@react-native-hooks";

const StyledBaseTouchable = styled(ThemeableStack, {
  hoverTheme: true,
  pressTheme: false,
  focusTheme: false,
  pressStyle: {
    opacity: 0.7,
  },
});

type TouchableProps = GetProps<typeof ThemeableStack>;

const BaseTouchableWithAutoHitSlop = forwardRef<TamaguiElement, TouchableProps>(
  (props: TouchableProps, ref) => {
    const [hitSlop, onLayout] = useAutoHitSlop(props.onLayout);

    return (
      <StyledBaseTouchable
        {...props}
        hitSlop={hitSlop}
        onLayout={onLayout}
        ref={ref}
      >
        {props.children}
      </StyledBaseTouchable>
    );
  },
);

BaseTouchableWithAutoHitSlop.displayName = "BaseTouchableWithAutoHitSlop";

/**
 *
 * @param props component props
 * @param props.children touchable children
 * @returns ThemeableStack with or without hitSlop support
 */
const BaseTouchable = forwardRef<TamaguiElement, TouchableProps>(
  (props: TouchableProps, ref) => {
    if (props.hitSlop) {
      // If `hitSlop` manually is added, respect it
      return (
        <StyledBaseTouchable {...props} ref={ref}>
          {props.children}
        </StyledBaseTouchable>
      );
    }

    // Otherwise, add `hitSlop` automatically
    return <BaseTouchableWithAutoHitSlop {...props} ref={ref} />;
  },
);

BaseTouchable.displayName = "BaseTouchable";

export { BaseTouchable };
export type { TouchableProps };
