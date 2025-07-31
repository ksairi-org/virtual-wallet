import type {
  AndroidNativeProps,
  DatePickerOptions,
  DateTimePickerEvent,
  IOSNativeProps,
} from "@react-native-community/datetimepicker";
import type { Input } from "tamagui";

import type { ForwardedRef } from "react";
import { useMemo, useCallback, forwardRef } from "react";

import { Platform } from "react-native";

import DateOrTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { YStack } from "tamagui";

import { BaseTextInput, type BaseTextInputProps } from "../BaseTextInput";
import { performLayoutAnimation } from "@react-native-functions";
import { useBooleanState } from "@react-hooks";

type DateTimePickerProps = DatePickerOptions & {
  mode: IOSNativeProps["mode"] & AndroidNativeProps["mode"];
};

type DateTimeInputProps = {
  labelText: string;
  dateTimePickerProps: DateTimePickerProps;
} & BaseTextInputProps;

const formatDateTime = (date: Date) => {
  const formattedDateTime = format(date, "MMMM do yyyy HH:mm");

  const dateArray = formattedDateTime.split(
    " ",
    formattedDateTime.split(" ").length - 1,
  );

  return dateArray
    .join(" ")
    .concat(" at ")
    .concat(
      formattedDateTime.split(" ")[formattedDateTime.split(" ").length - 1],
    );
};

const DateTimeInput = forwardRef(
  (
    {
      labelText,
      dateTimePickerProps,
      ...baseTextInputProps
    }: DateTimeInputProps,
    ref: ForwardedRef<typeof Input> | undefined,
  ) => {
    const {
      state: isPickerVisible,
      toggleState: handleTogglePickerVisibility,
    } = useBooleanState(false);

    const isTimePicker = dateTimePickerProps.mode === "time";

    const isDatePicker = dateTimePickerProps.mode === "date";

    const onChangeDateOrTimePicker = useCallback(
      (event: DateTimePickerEvent, date?: Date | undefined) => {
        dateTimePickerProps.onChange?.(event, date);

        // Android uses the imperative API to open and dismiss the picker
        if (Platform.OS === "android") {
          DateTimePickerAndroid.dismiss(dateTimePickerProps.mode);
        }
      },
      [dateTimePickerProps],
    );

    const handleToggleDateOrTimePicker = useCallback(() => {
      if (Platform.OS === "ios") {
        performLayoutAnimation();

        handleTogglePickerVisibility();
      } else {
        // Android uses the imperative API to open and dismiss the picker
        DateTimePickerAndroid.open({
          value: dateTimePickerProps.value,
          mode: dateTimePickerProps.mode,
          onChange: onChangeDateOrTimePicker,
        });
      }
    }, [
      dateTimePickerProps.mode,
      dateTimePickerProps.value,
      handleTogglePickerVisibility,
      onChangeDateOrTimePicker,
    ]);

    const valueToShow = useMemo(() => {
      if (isTimePicker) {
        return format(dateTimePickerProps.value, "HH:mm");
      }

      if (isDatePicker) {
        return format(dateTimePickerProps.value, "MMMM do yyyy");
      }

      return formatDateTime(dateTimePickerProps.value);
    }, [dateTimePickerProps.value, isDatePicker, isTimePicker]);

    const containerProps: BaseTextInputProps["containerProps"] = useMemo(
      () => ({
        onPress: handleToggleDateOrTimePicker,
      }),
      [handleToggleDateOrTimePicker],
    );

    const leftIconProps: BaseTextInputProps["leftIconProps"] = useMemo(
      () => ({
        width: 15,
        height: 15,
        iconName: isTimePicker ? "iconClock" : "iconCalendar",
        color: "$background-brand",
      }),
      [isTimePicker],
    );

    return (
      <YStack>
        <BaseTextInput
          ref={ref}
          labelText={labelText}
          leftIconProps={leftIconProps}
          containerProps={containerProps}
          value={valueToShow}
          editable={false}
          {...baseTextInputProps}
        />
        {isPickerVisible ? (
          <DateOrTimePicker
            display={Platform.select({
              ios: isTimePicker ? "spinner" : "inline",
              android: "default",
            })}
            onChange={onChangeDateOrTimePicker}
            {...dateTimePickerProps}
          />
        ) : null}
      </YStack>
    );
  },
);

DateTimeInput.displayName = "DateTimeInput";

export { DateTimeInput };
export type { DateTimeInputProps };
