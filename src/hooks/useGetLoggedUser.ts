import { supabase } from "@react-auth-client";
import { useGetProfiles } from "@react-query-sdk";
import { useUserStore } from "@stores";
import { useEffect, useMemo, useState } from "react";

type LoggedUser = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  profilePhotoUrl?: string;
} | null;

const useGetLoggedUser = () => {
  const [user, setUser] = useState<LoggedUser>(null);
  const [userId, setUserId] = useState(null);
  const { data: userProfileData } = useGetProfiles(
    { user_id: `eq.${userId}` },
    { query: { enabled: !!userId } },
  );
  const { firstName: firstNameStore, lastName: lastNameStore } = useUserStore(
    (state) => state,
  );
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user.id);
      const { firstName, lastName } = data.user.user_metadata;
      setUser({
        firstName: firstName || firstNameStore, // when logging thru social network
        lastName: lastName || lastNameStore, // we save full name on store
        email: data.user.email,
        id: data.user.id,
        profilePhotoUrl: userProfileData ? userProfileData[0].photo_url : null,
      });
    };
    getUser();
  }, [firstNameStore, lastNameStore, userProfileData]);

  const memoizedUser = useMemo(() => user, [user]);

  return memoizedUser;
};

export { useGetLoggedUser };
