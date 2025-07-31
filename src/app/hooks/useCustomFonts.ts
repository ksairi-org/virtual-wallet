import { useFonts } from "expo-font";

const useCustomFonts = () => {
  const [fontsLoaded, error] = useFonts({
    "Gotham-Bold": require("../../../assets/fonts/Gotham-Bold.otf"),

    "Gotham-Medium": require("../../../assets/fonts/Gotham-Medium.otf"),

    "Gotham-Regular": require("../../../assets/fonts/Gotham-Book.otf"),
  });

  if (error) {
    console.error("useCustomFonts ERROR:", error);
  }

  return fontsLoaded;
};

export { useCustomFonts };
