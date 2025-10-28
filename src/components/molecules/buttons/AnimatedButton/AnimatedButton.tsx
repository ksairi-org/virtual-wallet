/* eslint-disable react-hooks/exhaustive-deps */

import type { ColorTokens, Token } from "tamagui";

import type { ReactNode } from "react";
import { useEffect } from "react";

import type { StyleProp, ViewStyle } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { getTokenValue } from "tamagui";
import { ThrottledButton } from "../ThrottledButton";
import { CircularLoadingSpinner } from "../../CircularLoadingSpinner";

type AnimatedButtonProps = {
  width: number;
  height?: number;
  padding?: Token;
  backgroundColor: ColorTokens;
  disabled?: boolean;
  loading?: boolean;
  opacity?: number;
  onPress?: () => void;
  pointerEvents?: "auto" | "none";
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

// This is a simple button that scales the text down when pressed and scales back up when released.
const AnimatedButton = ({
  width,
  height,
  padding,
  backgroundColor,
  disabled,
  loading,
  opacity,
  onPress,
  pointerEvents,
  style,
  children,
}: AnimatedButtonProps) => {
  const scale = useSharedValue(1);
  const buttonWidth = useSharedValue(width);
  const buttonOpacity = useSharedValue(opacity ?? (disabled ? 0.1 : 1));

  useEffect(() => {
    buttonWidth.value = withTiming(width, {
      duration: 300,
    });
  }, [width]);

  useEffect(() => {
    const targetOpacity = opacity ?? (disabled ? 0.1 : 1);

    buttonOpacity.value = withTiming(targetOpacity, {
      duration: 300,
    });
  }, [opacity, disabled]);

  const animateButtonStyleChange = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    width: buttonWidth.value,
  }));

  const animateTextScaleChange = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const springConfig = {
    stiffness: 300,
    damping: 10,
    mass: 0.5,
  };

  return (
    <Animated.View style={[animateButtonStyleChange, style]}>
      <ThrottledButton
        borderRadius={"$full"}
        justifyContent={"center"}
        alignItems={"center"}
        backgroundColor={backgroundColor}
        height={height}
        padding={padding && getTokenValue(padding)}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.95, springConfig);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, springConfig);
        }}
        pointerEvents={pointerEvents ? pointerEvents : "auto"}
      >
        {loading ? (
          <CircularLoadingSpinner
            size={"$2xl"}
            backgroundColor={"$background-action"}
            spinningPieceColor={"$text-body"}
          />
        ) : (
          <Animated.View style={animateTextScaleChange}>
            {children}
          </Animated.View>
        )}
      </ThrottledButton>
    </Animated.View>
  );
};

export { AnimatedButton };
