import { patchProfiles, Profiles } from "@react-query-sdk";
import { showAlert } from "@utils";
import { useCallback } from "react";

const useUpdateProfile = (params: Profiles) => {
  const updateProfile = useCallback(async () => {
    try {
      await patchProfiles(params, { user_id: `eq.${params.user_id}` });
    } catch (e) {
      showAlert(e.message);
    }
  }, [params]);

  return updateProfile;
};

export { useUpdateProfile };
