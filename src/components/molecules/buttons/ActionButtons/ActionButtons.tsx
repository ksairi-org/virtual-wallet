import type { PrimaryButtonProps } from "../PrimaryButton";
import type { SecondaryButtonProps } from "../SecondaryButton";
import type { TertiaryButtonProps } from "../TertiaryButton";

import { PrimaryButton } from "../PrimaryButton";
import { SecondaryButton } from "../SecondaryButton";
import { TertiaryButton } from "../TertiaryButton";
import { Containers } from "@ui-containers";

type ActionButtonsConfig = {
  firstButton: PrimaryButtonProps;
  secondButton?: SecondaryButtonProps | TertiaryButtonProps;
  thirdButton?: SecondaryButtonProps;
  showTopBorder?: boolean;
};

type ActionButtonsProps = {
  config: ActionButtonsConfig;
};

const ActionButtons = ({ config }: ActionButtonsProps) => {
  const { firstButton, secondButton, thirdButton, showTopBorder } = config;

  return (
    <Containers.SubY
      paddingVertical={"$2xl"}
      paddingRight={"$2xl"}
      paddingLeft={"$2xl"}
      alignItems={"center"}
      gap={"$2xl"}
      borderTopColor={showTopBorder ? "$border-brand" : undefined}
      borderTopWidth={showTopBorder ? 2 : undefined}
    >
      <PrimaryButton {...firstButton} />

      {secondButton && !thirdButton ? (
        <SecondaryButton {...(secondButton as SecondaryButtonProps)} />
      ) : null}

      {secondButton && thirdButton ? (
        <>
          {/*
              Yes, Tertiary Button is used as the middle button in this case,
              which makes it the second button, Tertiary is just the styling.
          */}
          <TertiaryButton {...(secondButton as TertiaryButtonProps)} />
          <SecondaryButton {...thirdButton} />
        </>
      ) : null}
    </Containers.SubY>
  );
};

export { ActionButtons };
export type { ActionButtonsProps, ActionButtonsConfig };
