import { useState, useEffect } from "react";
import { supabase } from "@react-auth-client";
import { BUCKET_NAME } from "@constants";
import { BaseIcon } from "@icons";
import { Image } from "@expo-image";
import { Spacer, XStack, YStack } from "tamagui";
import { BaseTouchable } from "@ui-touchables";
import { ActivityIndicator } from "react-native";

type AvatarProps = {
  size: number;
  url: string | null;
  customKey: number;
  onPressOpenCamera?: () => void;
  onPressShowGallery?: () => void;
  isUpLoading?: boolean;
};

const Avatar = ({
  url,
  size = 150,
  customKey,
  onPressShowGallery,
  onPressOpenCamera,
  isUpLoading,
}: AvatarProps) => {
  const [loading, setLoading] = useState(true);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    const getImagePublicUrl = async (path: string) => {
      try {
        const { data } = await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(url, 60 * 60);
        setPublicUrl(data.signedUrl);
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error downloading image: ", error.message);
        }
      }
    };
    if (url) {
      getImagePublicUrl(url);
    }
  }, [customKey, url]);

  return (
    <XStack>
      <Image
        source={publicUrl}
        style={avatarSize}
        onLoad={() => {
          setLoading(false);
        }}
      />
      {loading ? <ActivityIndicator size={"small"} /> : null}
      {loading ? null : (
        <>
          <Spacer size={"$sm"} />
          <YStack height={avatarSize.height} justifyContent="center">
            {onPressShowGallery ? (
              <>
                <BaseTouchable
                  onPress={onPressShowGallery}
                  disabled={isUpLoading}
                >
                  <BaseIcon
                    width={20}
                    height={20}
                    iconName={"iconUpload"}
                    color={"$icon-primary"}
                  />
                </BaseTouchable>

                <Spacer size={"$sm"} />
              </>
            ) : null}
            {onPressOpenCamera ? (
              <BaseTouchable onPress={onPressOpenCamera} disabled={isUpLoading}>
                <BaseIcon
                  width={20}
                  height={20}
                  iconName={"iconCircleGraph"}
                  color={"$icon-primary"}
                />
              </BaseTouchable>
            ) : null}
          </YStack>
        </>
      )}
    </XStack>
  );
};

export { Avatar };
