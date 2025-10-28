import { BaseTouchable } from "@ui-touchables";
import { useState, useCallback } from "react";
import type { ComponentProps } from "react";

type ThrottledButtonProps = Omit<
  ComponentProps<typeof BaseTouchable>,
  "onPress"
> & {
  onPress?: () => void;
  throttleTime?: number;
};

const ThrottledButton = ({
  onPress,
  throttleTime = 350,
  ...props
}: ThrottledButtonProps) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const handlePress = useCallback(() => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);

      onPress?.();

      setTimeout(() => {
        setIsButtonDisabled(false);
      }, throttleTime);
    }
  }, [isButtonDisabled, onPress, throttleTime]);

  return (
    <BaseTouchable onPress={handlePress} {...props}>
      {props.children}
    </BaseTouchable>
  );
};

export { ThrottledButton };
