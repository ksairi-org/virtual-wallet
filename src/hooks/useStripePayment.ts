import { useStripe } from "@stripe/stripe-react-native";
import { useCallback } from "react";

const MERCHANT_DISPLAY_NAME = "Virtual Wallet";

export const useStripePayment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const presentPayment = useCallback(
    async (clientSecret: string): Promise<void> => {
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: MERCHANT_DISPLAY_NAME,
      });
      if (initError) throw new Error(initError.message);

      const { error } = await presentPaymentSheet();
      if (error) throw new Error(error.message);
    },
    [initPaymentSheet, presentPaymentSheet]
  );

  return { presentPayment };
};
