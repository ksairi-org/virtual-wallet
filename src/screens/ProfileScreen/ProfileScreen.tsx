import { useEffect, useState } from "react";
import { Containers } from "@ui-containers";
import { Spacer } from "tamagui";
import { BaseTextInput, SubmitButton } from "@molecules";
import { BodyRegularSm, LabelSemiboldLg } from "@fonts";
import { useAuthStore } from "@react-auth-storage";
import { useBooleanState } from "@react-hooks";
import { patchProfiles, useGetCurrencies } from "@react-query-sdk";
import { supabase } from "@react-auth-client";
import { Avatar } from "@organisms";
import { useGetLoggedUserProfile } from "@hooks";
import { showAlert } from "@utils";

const profilePhotoFileName = "profile-photo";

const ProfileScreen = () => {
  const {
    firstName,
    lastName,
    email,
    id: userId,
    profilePhotoUrl,
  } = useGetLoggedUserProfile() ?? {};
  const handleLogout = useAuthStore((state) => state.handleLogout);
  const { state: isLoading, toggleState: toggleIsLoading } =
    useBooleanState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const { data, error } = useGetCurrencies();

  console.log("Currencies Hook data:", data, "Error:", error);

  useEffect(() => {
    setAvatarUrl(profilePhotoUrl);
  }, [profilePhotoUrl]);

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

  const updateProfile = (url: string) => {
    try {
      patchProfiles(
        { photo_url: url, user_id: userId },
        { user_id: `eq.${userId}` },
      );
    } catch (e) {
      showAlert(e.message);
    }
  };
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

        <Avatar
          size={200}
          url={avatarUrl}
          destinationPath={`${userId}/${profilePhotoFileName}`}
          onUpload={(url: string) => {
            setAvatarUrl(() => {
              updateProfile(url);
              return url;
            });
          }}
        />

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

export { ProfileScreen };
