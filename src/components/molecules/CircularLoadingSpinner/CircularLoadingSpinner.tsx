/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from 'react';

import { StyleSheet } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { type ColorTokens, type Token } from 'tamagui';

import { Circle } from './Circle';

const styles = StyleSheet.create({
  centralize: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type CircularLoadingSpinnerProps = {
  size: Token;
  thickness?: number;
  backgroundColor: ColorTokens;
  spinningPieceColor: ColorTokens;
  opacity?: number;
  entranceDelay?: number;
  opacityChangeDuration?: number;
};

const CircularLoadingSpinner = ({
  size,
  thickness = 4,
  backgroundColor,
  spinningPieceColor,
  opacity = 1,
  entranceDelay = 0,
  opacityChangeDuration = 300,
}: CircularLoadingSpinnerProps) => {
  const rotateAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);

  useEffect(() => {
    rotateAnim.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [rotateAnim]);

  useEffect(() => {
    setTimeout(() => {
      opacityAnim.value = withTiming(opacity, {
        duration: opacityChangeDuration,
      });
    }, entranceDelay);
  }, [opacity]);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnim.value * 360}deg` }],
    opacity: opacityAnim.value,
  }));

  return (
    <Animated.View style={[styles.centralize, spinnerStyle]}>
      <Circle
        size={size}
        thickness={thickness}
        backgroundColor={backgroundColor}
        spinningPieceColor={spinningPieceColor}
      />
    </Animated.View>
  );
};

export { CircularLoadingSpinner };
