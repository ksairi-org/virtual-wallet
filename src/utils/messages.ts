import * as Burnt from "burnt";
import { AlertOptions, ToastOptions } from "burnt/build/types";

const showAlert = (props: AlertOptions) => {
  Burnt.alert({
    ...props,
  });
};

const showToast = (props: ToastOptions) => {
  Burnt.toast({
    ...props,
  });
};

export { showAlert, showToast };
