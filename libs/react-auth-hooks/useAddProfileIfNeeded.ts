import { useGetEntityById } from "@hooks";
import {
  GetProfilesParams,
  Profiles,
  useGetProfiles,
  usePostProfiles,
} from "@react-query-sdk";
import { useCallback, useState } from "react";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return undefined;
};

const useAddProfileIfNeeded = () => {
  const [userId, setUserId] = useState<
    GetProfilesParams["user_id"] | undefined
  >();

  const { refetch: fetchProfiles, error: getProfileError } = useGetEntityById<
    Profiles[],
    GetProfilesParams
  >(
    useGetProfiles,
    { user_id: userId },
    {
      query: { enabled: false },
    },
  );

  const { mutateAsync: addProfile, error: addProfileError } = usePostProfiles();

  const addProfileIfNeeded = useCallback(
    async (params: Profiles) => {
      setUserId(params.user_id);
      const { data: userProfileData } = await fetchProfiles();
      if (!userProfileData?.length) {
        await addProfile({ data: params });
      }
    },
    [addProfile, fetchProfiles],
  );

  return {
    addProfileIfNeeded,
    error: getErrorMessage(getProfileError || addProfileError),
  };
};

export { useAddProfileIfNeeded };
