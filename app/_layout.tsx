import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ManropeExtraLight: require("../assets/fonts/Manrope-ExtraLight.ttf"),
    ManropeLight: require("../assets/fonts/Manrope-Light.ttf"),
    ManropeRegular: require("../assets/fonts/Manrope-Regular.ttf"),
    ManropeMedium: require("../assets/fonts/Manrope-Medium.ttf"),
    ManropeSemiBold: require("../assets/fonts/Manrope-SemiBold.ttf"),
    ManropeBold: require("../assets/fonts/Manrope-Bold.ttf"),
    ManropeExtraBold: require("../assets/fonts/Manrope-ExtraBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GluestackUIProvider colorMode="dark" config={config}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </GluestackUIProvider>
  );
}
