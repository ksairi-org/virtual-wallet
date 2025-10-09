import { GlassView, type GlassViewProps } from "expo-glass-effect";
import { styled } from "tamagui";

const StyledGlassView = styled(GlassView);

/**
 *
 * @param props props
 * @param props.children content to show within the container
 * @returns JSX container containing its children
 */
const ScreenYGlassSubContainer = ({ children, ...props }: GlassViewProps) => (
  <StyledGlassView {...props} flexDirection="column">
    {children}
  </StyledGlassView>
);

export { ScreenYGlassSubContainer };
