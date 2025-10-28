import { BodyBoldLg, BodyBoldSm } from "@fonts";
import { CTAButton } from "@molecules";
import { Containers } from "@ui-containers";
import { useState } from "react";
import { Spacer, TextArea } from "tamagui";
import { OpenAI } from "@ai";

const AIScreen = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOnPressSend = async () => {
    setLoading(true);
    const res = await OpenAI.prompt(text);
    setResponse(res);
    setLoading(false);
  };

  return (
    <Containers.Screen>
      <Containers.SubY>
        <Spacer size={"$md"} />
        <TextArea
          placeholder="Prompt"
          value={text}
          height={200}
          onChangeText={(text) => setText(text)}
        />

        <Spacer size={"$md"} />

        <CTAButton loading={loading} onPress={handleOnPressSend}>
          <BodyBoldLg color={"$text-subtle"}>{"Send"}</BodyBoldLg>
        </CTAButton>

        {response ? (
          <>
            <BodyBoldSm>{"Response:"}</BodyBoldSm>
            <BodyBoldLg>{response} </BodyBoldLg>
          </>
        ) : null}
      </Containers.SubY>
    </Containers.Screen>
  );
};
export { AIScreen };
