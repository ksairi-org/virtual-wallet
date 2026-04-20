import { BodyBoldLg, BodyBoldSm, BodyRegularSm } from "@fonts";
import { CTAButton } from "@molecules";
import { useInvokeMcpClient, InvokeMcpClientBody } from "@react-query-sdk";
import { Containers } from "@ui-containers";
import { isAxiosError } from "axios";
import { useState } from "react";
import { Trans, useLingui } from "@lingui/react/macro";
import { Pressable } from "react-native";
import { Spacer, TextArea, XStack, YStack } from "tamagui";

type Provider = InvokeMcpClientBody["provider"];

const PROVIDERS: { label: string; value: Provider }[] = [
  { label: "Claude", value: "claude" },
  { label: "OpenAI", value: "openai" },
];

const AIScreen = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [provider, setProvider] = useState<Provider>("claude");
  const { t } = useLingui();

  const { mutate, isPending, isError, error } = useInvokeMcpClient();

  const handleOnPressSend = () => {
    setResponse("");
    mutate(
      { data: { prompt: text, provider } },
      { onSuccess: (res) => setResponse(res.response ?? "") },
    );
  };

  const errorMessage = isAxiosError(error) ? error.response?.data?.error : undefined;

  return (
    <Containers.Screen>
      <Containers.SubY>
        <Spacer size={"$md"} />

        <XStack
          borderRadius={"$md"}
          borderWidth={1}
          borderColor={"$borderColor"}
          overflow="hidden"
        >
          {PROVIDERS.map(({ label, value }) => {
            const isSelected = provider === value;
            return (
              <Pressable
                key={value}
                onPress={() => setProvider(value)}
                style={{ flex: 1 }}
              >
                <YStack
                  paddingVertical={"$sm"}
                  alignItems="center"
                  backgroundColor={isSelected ? "$color" : undefined}
                >
                  <BodyBoldSm color={isSelected ? "$background" : "$color"}>
                    {label}
                  </BodyBoldSm>
                </YStack>
              </Pressable>
            );
          })}
        </XStack>

        <Spacer size={"$md"} />

        <TextArea
          placeholder={t`Prompt`}
          value={text}
          height={200}
          onChangeText={(text) => setText(text)}
        />

        <Spacer size={"$md"} />

        <CTAButton loading={isPending} onPress={handleOnPressSend}>
          <BodyBoldLg color={"$text-subtle"}><Trans>Send</Trans></BodyBoldLg>
        </CTAButton>

        {isError && errorMessage ? (
          <>
            <Spacer size={"$sm"} />
            <BodyBoldSm><Trans>Error:</Trans></BodyBoldSm>
            <BodyRegularSm>{errorMessage}</BodyRegularSm>
          </>
        ) : null}

        {response ? (
          <>
            <Spacer size={"$sm"} />
            <BodyBoldSm><Trans>Response:</Trans></BodyBoldSm>
            <BodyRegularSm>{response}</BodyRegularSm>
          </>
        ) : null}
      </Containers.SubY>
    </Containers.Screen>
  );
};

export { AIScreen };
