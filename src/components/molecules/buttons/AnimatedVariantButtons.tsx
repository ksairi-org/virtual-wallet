import type { ReactNode } from "react";

import { getTokenValue } from "tamagui";

import { AnimatedButton } from "@ksairi-org/ui-button-animated";
import type { AnimatedButtonProps } from "@ksairi-org/ui-button-animated";

type VariantButtonProps = Omit<
  Pick<AnimatedButtonProps, "width" | "opacity" | "loading" | "disabled" | "onPress">,
  "width"
> & {
  width?: number;
  children: ReactNode;
};

const defaultWidth = 300;
const defaultHeight = getTokenValue("$2xl");

const PrimaryButton = ({ children, width = defaultWidth, ...props }: VariantButtonProps) => (
  <AnimatedButton variant="primary" width={width} height={defaultHeight} {...props}>
    {children}
  </AnimatedButton>
);

const SecondaryButton = ({ children, width = defaultWidth, ...props }: VariantButtonProps) => (
  <AnimatedButton variant="secondary" width={width} height={defaultHeight} {...props}>
    {children}
  </AnimatedButton>
);

const TertiaryButton = ({ children, width = defaultWidth, ...props }: VariantButtonProps) => (
  <AnimatedButton variant="tertiary" width={width} height={defaultHeight} {...props}>
    {children}
  </AnimatedButton>
);

export { PrimaryButton, SecondaryButton, TertiaryButton };
export type { VariantButtonProps };
