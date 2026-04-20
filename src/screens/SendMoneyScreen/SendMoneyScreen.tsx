import { useState } from "react";
import { Spacer, YStack } from "tamagui";
import { Containers } from "@ui-containers";
import {
  DisplayBoldMd,
  LabelSemiboldLg,
  BodyRegularMd,
  BodyBoldMd,
} from "@fonts";
import { BaseTextInput, PrimaryButton } from "@molecules";
import { useGetLoggedUserProfile } from "@hooks";
import { useGetWallets } from "@react-query-sdk";
import { getQueryFilters, showAlert } from "@utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { ActivityIndicator } from "react-native";

const MIN_AMOUNT = 0.01;
const MAX_AMOUNT = 10_000;

const SendMoneyScreen = () => {
  const { t } = useLingui();
  const user = useGetLoggedUserProfile();
  const userId = user?.id;

  const [recipientEmail, setRecipientEmail] = useState("");
  const [amountText, setAmountText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { data: wallets, isLoading: isLoadingWallet } = useGetWallets(
    getQueryFilters({ user_id: userId }),
    { query: { enabled: !!userId } },
  );

  const wallet = wallets?.[0];
  const balance = wallet?.balance ?? 0;

  const parsedAmount = parseFloat(amountText);
  const isAmountValid =
    !isNaN(parsedAmount) &&
    parsedAmount >= MIN_AMOUNT &&
    parsedAmount <= MAX_AMOUNT;
  const isRecipientValid = recipientEmail.trim().length > 0;
  const hasSufficientFunds = parsedAmount <= balance;

  const canSend =
    isAmountValid && isRecipientValid && hasSufficientFunds && !isSending;

  const handleSend = async () => {
    if (!canSend) return;
    setIsSending(true);
    try {
      // TODO: wire up real mutation (e.g. useCreateTransaction) once available
      await new Promise<void>((resolve) => setTimeout(resolve, 800));
      showAlert({
        title: t`Success`,
        preset: "done",
      });
      setRecipientEmail("");
      setAmountText("");
    } catch {
      showAlert({ title: t`Transfer failed. Please try again.`, preset: "error" });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoadingWallet) {
    return (
      <Containers.Screen>
        <Containers.SubY flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" />
        </Containers.SubY>
      </Containers.Screen>
    );
  }

  return (
    <Containers.Screen>
      <Containers.SubY>
        <Spacer size="$lg" />

        <LabelSemiboldLg color="$text-inactive">
          <Trans>Available balance</Trans>
        </LabelSemiboldLg>
        <Spacer size="$xs" />
        <DisplayBoldMd color="$text-primary">
          {`$${balance.toFixed(2)}`}
        </DisplayBoldMd>

        <Spacer size="$xl" />

        <BaseTextInput
          labelText={t`Recipient email`}
          value={recipientEmail}
          onChangeText={setRecipientEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={t`you@example.com`}
        />

        <Spacer size="$md" />

        <BaseTextInput
          labelText={t`Amount (USD)`}
          value={amountText}
          onChangeText={setAmountText}
          keyboardType="decimal-pad"
          placeholder={t`0.00`}
        />

        {amountText.length > 0 && !isNaN(parsedAmount) && !hasSufficientFunds ? (
          <YStack marginTop="$xs">
            <BodyRegularMd color="$text-error">
              <Trans>Insufficient funds.</Trans>
            </BodyRegularMd>
          </YStack>
        ) : null}

        <Spacer size="$xl" />

        <PrimaryButton
          text={t`Send Money`}
          onPress={handleSend}
          disabled={!canSend}
          loading={isSending}
        />

        <Spacer size="$md" />

        <BodyBoldMd color="$text-inactive" textAlign="center">
          <Trans>Transfers are instant and irreversible.</Trans>
        </BodyBoldMd>
      </Containers.SubY>
    </Containers.Screen>
  );
};

export { SendMoneyScreen };
