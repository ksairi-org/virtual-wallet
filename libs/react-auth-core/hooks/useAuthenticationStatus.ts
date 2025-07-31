import { useAuthStore } from "@react-auth-storage";

/**
 * @returns The authentication status of the user
 */
const useAuthenticationStatus = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  // The User has submitted a phone number but still has not submitted a valid code to be logged in.
  if (accessToken && !refreshToken) {
    return "otp flow";
  }

  if (accessToken && refreshToken) {
    return "logged in";
  }

  return "logged out";
};

export { useAuthenticationStatus };
