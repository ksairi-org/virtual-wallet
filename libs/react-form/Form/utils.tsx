import type { HandledFormElementProps } from "./types";
import type { FieldValues } from "react-hook-form";

import { memo, isValidElement } from "react";
import type { FC, ReactElement } from "react";

/**
 * Creates a component that will be auto-registered with `react-hook-form` via `name` prop
 * @param WrappedComponent component to add additional props to
 * @returns component with additional props added (name, nextInputToFocus)
 */
const createHandledFormElement = <
  Component extends FC<any>,
  SchemaType extends FieldValues,
>(
  WrappedComponent: Component,
) => {
  const MemoizedComponent = memo(
    (props: Parameters<Component>[0] & HandledFormElementProps<SchemaType>) => (
      <WrappedComponent ref={props.ref} {...props} />
    ),
  );
  MemoizedComponent.displayName = "MemoizedComponent";

  return MemoizedComponent;
};

/**
 * Gets the name of the next input to focus
 * @param allChildrenWithNames names of all `children` passed to Form to be auto-registered with `react-hook-form` via `name` prop
 * @param currentChildName name of current child being mapped over
 * @returns Path<FieldValues> | undefined
 */
const getNextInputName = (
  allChildrenWithNames: string[],
  currentChildName: string,
) => {
  const indexOfCurrentChild = allChildrenWithNames.indexOf(currentChildName);
  const nextIndex = indexOfCurrentChild > -1 ? indexOfCurrentChild + 1 : -1;

  if (nextIndex === -1) {
    return undefined;
  }

  return allChildrenWithNames[nextIndex];
};

// Type guard to check if a child is a valid React element with props
const isReactElementWithProps = (
  child: unknown,
): child is ReactElement<Record<string, any>> => {
  return (
    isValidElement(child) &&
    typeof child.props === "object" &&
    child.props !== null
  );
};

export { createHandledFormElement, getNextInputName, isReactElementWithProps };
