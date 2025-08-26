import { useEffect } from "react";
import { supabase } from "@backend";
import { Containers } from "@ui-containers";
import { Spacer } from "tamagui";
import { BaseTextInput, SubmitButton } from "@molecules";
import { BodyRegularSm, LabelSemiboldLg } from "@fonts";
import { useUserStore } from "@stores";
import { useAuthStore } from "@react-auth-storage";
import { useBooleanState } from "@react-hooks";
import { useGetCurrencies } from "@react-query-sdk";

const AccountScreen = () => {
  const { firstName, lastName, email } = useUserStore((state) => state);
  const handleLogout = useAuthStore((state) => state.handleLogout);
  const { state: isLoading, toggleState: toggleIsLoading } =
    useBooleanState(false);
  const { data, error } = useGetCurrencies();

  console.log("Currencies Hook data:", data, "Error:", error);

  const handleOnPressLogout = async () => {
    try {
      toggleIsLoading();
      await supabase.auth.signOut();
      handleLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      toggleIsLoading();
    }
  };

  useEffect(() => {
    // const getProfile = async () => {
    //   try {
    //     setLoading(true);
    //     if (!session?.user) throw new Error("No user on the session!");
    //     const { data, error, status } = await supabase
    //       .from("profiles")
    //       .select(`username, website, avatar_url`)
    //       .eq("id", session?.user.id)
    //       .single();
    //     if (error && status !== 406) {
    //       throw error;
    //     }
    //     console.log("Profile data:", error);
    //     if (data) {
    //       setDisplayName(data.displayName);
    //       setAvatarUrl(data.avatar_url);
    //     }
    //   } catch (error) {
    //     if (error instanceof Error) {
    //       showAlert({ preset: "error", title: error.message });
    //     }
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // if (session) {
    //   getProfile();
    // }
  }, []);

  return (
    <Containers.Screen>
      <Containers.SubY>
        <BodyRegularSm>{"Email"}</BodyRegularSm>
        <Spacer size={"$md"} />
        <BaseTextInput value={email} disabled />

        <Spacer size={"$button-md"} />

        <BodyRegularSm>{"Fullname"}</BodyRegularSm>
        <Spacer size={"$md"} />
        <BaseTextInput value={firstName + " " + lastName} />

        <Spacer size={"$button-md"} />

        {/* <SubmitButton
          onPress={() => updateProfile({ displayName, avatar_url: avatarUrl })}
          loading={loading}
          disabled={loading}
        >
          <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
            {"Update"}
          </LabelSemiboldLg>
        </SubmitButton> */}

        <Spacer size={"$button-md"} />

        <SubmitButton onPress={handleOnPressLogout} loading={isLoading}>
          <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
            {"Sign Out"}
          </LabelSemiboldLg>
        </SubmitButton>
      </Containers.SubY>
    </Containers.Screen>
  );
};

export { AccountScreen };
