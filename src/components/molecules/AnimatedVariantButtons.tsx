import type { ReactNode } from "react";

import { SizingAnimatedButton } from "@ksairi-org/ui-button-animated";
import type { SizingAnimatedButtonProps } from "@ksairi-org/ui-button-animated";

type VariantButtonProps = Pick<
  SizingAnimatedButtonProps,
  "opacity" | "loading" | "disabled" | "onPress"
> & {
  children: ReactNode;
};

const PrimaryButton = ({ children, ...props }: VariantButtonProps) => (
  <SizingAnimatedButton backgroundColor="$surface-invert" spinnerPieceColor="$text-body" {...props}>
    {children}
  </SizingAnimatedButton>
);

const SecondaryButton = ({ children, ...props }: VariantButtonProps) => (
  <SizingAnimatedButton backgroundColor="$surface-primary" spinnerPieceColor="$text-body" {...props}>
    {children}
  </SizingAnimatedButton>
);

const TertiaryButton = ({ children, ...props }: VariantButtonProps) => (
  <SizingAnimatedButton backgroundColor="$surface-secondary" spinnerPieceColor="$text-body" {...props}>
    {children}
  </SizingAnimatedButton>
);

export { PrimaryButton, SecondaryButton, TertiaryButton };
export type { VariantButtonProps };
