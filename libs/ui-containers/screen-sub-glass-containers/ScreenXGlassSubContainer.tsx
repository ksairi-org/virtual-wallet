import { GlassView, type GlassViewProps } from "expo-glass-effect";
import { styled } from "tamagui";

const StyledGlassView = styled(GlassView);

/**
 *
 * @param props props
 * @param props.children content to show within the container
 * @returns JSX container containing its children
 */
const ScreenXGlassSubContainer = ({ children, ...props }: GlassViewProps) => (
  <StyledGlassView {...props} flexDirection="row">
    {children}
  </StyledGlassView>
);

export { ScreenXGlassSubContainer };
