import { useState, useCallback } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Spacer, XStack, YStack } from "tamagui";
import { FlashList } from "@shopify/flash-list";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import type { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types";
import { MotiView } from "moti";
import { Containers } from "@ksairi-org/ui-containers";
import {
  DisplayBoldMd,
  HeadingSemiboldMd,
  BodyRegularMd,
  BodyBoldMd,
  LabelSemiboldLg,
  BodyRegularSm,
} from "@fonts";
import { useGetLoggedUserProfile, useBottomSheet } from "@hooks";
import { useGetTransactions, useGetWallets } from "@ksairi-org/react-query-sdk";
import type { Transactions } from "@ksairi-org/react-query-sdk";
import { getQueryFilters } from "@utils";
import { Trans, useLingui } from "@lingui/react/macro";

const BALANCE_ANIMATION_DURATION_MS = 400;
const SHEET_SNAP_POINTS = ["35%"];

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
});

const WalletScreen = () => {
  const { t } = useLingui();
  const user = useGetLoggedUserProfile();
  const userId = user?.id;

  const [selectedTx, setSelectedTx] = useState<Transactions | null>(null);
  const { ref: sheetRef, open: openSheet } = useBottomSheet();

  const { data: wallets, isLoading: isLoadingWallet } = useGetWallets(
    getQueryFilters({ user_id: userId }),
    { query: { enabled: !!userId } },
  );

  const wallet = wallets?.[0];
  const walletId = wallet?.wallet_id;

  const { data: transactions, isLoading: isLoadingTransactions } =
    useGetTransactions(getQueryFilters({ wallet_id: walletId }), {
      query: { enabled: !!walletId },
    });

  const handleTxPress = useCallback(
    (tx: Transactions) => {
      setSelectedTx(tx);
      openSheet();
    },
    [openSheet],
  );

  const renderItem = useCallback(
    ({ item }: { item: Transactions }) => (
      <YStack
        paddingHorizontal="$md"
        paddingVertical="$sm"
        borderBottomWidth={1}
        borderBottomColor="$border-strong"
        pressStyle={{ opacity: 0.7 }}
        onPress={() => handleTxPress(item)}
      >
        <XStack justifyContent="space-between" alignItems="center">
          <BodyRegularMd color="$text-action-inverse" flex={1}>
            {item.description ?? t`Transaction`}
          </BodyRegularMd>
          <BodyBoldMd
            color={item.amount >= 0 ? "$text-success" : "$text-error"}
          >
            {`${item.amount >= 0 ? "+" : ""}$${Math.abs(item.amount).toFixed(2)}`}
          </BodyBoldMd>
        </XStack>
        {item.transaction_date ? (
          <BodyRegularSm color="$text-inactive">
            {new Date(item.transaction_date).toLocaleDateString()}
          </BodyRegularSm>
        ) : null}
      </YStack>
    ),
    [handleTxPress, t],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const listHeader = (
    <Containers.SubY>
      <Spacer size="$lg" />
      <LabelSemiboldLg color="$text-inactive">
        <Trans>My Wallet</Trans>
      </LabelSemiboldLg>
      <Spacer size="$sm" />
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: BALANCE_ANIMATION_DURATION_MS }}
      >
        <DisplayBoldMd color="$text-action-inverse">
          {`$${(wallet?.balance ?? 0).toFixed(2)}`}
        </DisplayBoldMd>
      </MotiView>
      <Spacer size="$xl" />
      <HeadingSemiboldMd color="$text-action-inverse">
        <Trans>Recent Transactions</Trans>
      </HeadingSemiboldMd>
      <Spacer size="$md" />
    </Containers.SubY>
  );

  if (isLoadingWallet || isLoadingTransactions) {
    return (
      <Containers.Screen backgroundColor="$background-action">
        <Containers.SubY flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color="white" />
        </Containers.SubY>
      </Containers.Screen>
    );
  }

  return (
    <Containers.Screen
      backgroundColor="$background-action"
      shouldAutoResize={false}
    >
      <FlashList
        data={transactions || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.transaction_id.toString()}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <Containers.SubY>
            <BodyRegularMd color="$text-inactive">
              <Trans>No transactions yet.</Trans>
            </BodyRegularMd>
          </Containers.SubY>
        }
        contentContainerStyle={styles.listContent}
      />

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={SHEET_SNAP_POINTS}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.sheetContent}>
          {selectedTx ? (
            <YStack gap="$sm">
              <HeadingSemiboldMd>
                {selectedTx.description ?? t`Transaction`}
              </HeadingSemiboldMd>
              <XStack justifyContent="space-between">
                <BodyRegularMd color="$text-inactive">
                  <Trans>Amount</Trans>
                </BodyRegularMd>
                <BodyBoldMd
                  color={
                    selectedTx.amount >= 0 ? "$text-success" : "$text-error"
                  }
                >
                  {`${selectedTx.amount >= 0 ? "+" : ""}$${Math.abs(selectedTx.amount).toFixed(2)}`}
                </BodyBoldMd>
              </XStack>
              {selectedTx.transaction_date ? (
                <XStack justifyContent="space-between">
                  <BodyRegularMd color="$text-inactive">
                    <Trans>Date</Trans>
                  </BodyRegularMd>
                  <BodyRegularMd>
                    {new Date(
                      selectedTx.transaction_date,
                    ).toLocaleDateString()}
                  </BodyRegularMd>
                </XStack>
              ) : null}
            </YStack>
          ) : null}
        </BottomSheetView>
      </BottomSheetModal>
    </Containers.Screen>
  );
};

export { WalletScreen };
