import { renderHook, act } from "@testing-library/react-native";
import { useBottomSheet } from "../useBottomSheet";

describe("useBottomSheet", () => {
  it("returns a ref, open, and close", () => {
    const { result } = renderHook(() => useBottomSheet());

    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.open).toBe("function");
    expect(typeof result.current.close).toBe("function");
  });

  it("open calls present on the ref", () => {
    const { result } = renderHook(() => useBottomSheet());
    const presentMock = jest.fn();

    // Simulate a mounted BottomSheetModal by setting the ref value
    Object.defineProperty(result.current.ref, "current", {
      value: { present: presentMock, dismiss: jest.fn() },
      writable: true,
    });

    act(() => {
      result.current.open();
    });

    expect(presentMock).toHaveBeenCalledTimes(1);
  });

  it("close calls dismiss on the ref", () => {
    const { result } = renderHook(() => useBottomSheet());
    const dismissMock = jest.fn();

    Object.defineProperty(result.current.ref, "current", {
      value: { present: jest.fn(), dismiss: dismissMock },
      writable: true,
    });

    act(() => {
      result.current.close();
    });

    expect(dismissMock).toHaveBeenCalledTimes(1);
  });

  it("open and close are stable across re-renders", () => {
    const { result, rerender } = renderHook(() => useBottomSheet());
    const { open: open1, close: close1 } = result.current;

    rerender({});

    expect(result.current.open).toBe(open1);
    expect(result.current.close).toBe(close1);
  });
});
