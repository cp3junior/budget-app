import { config } from "@gluestack-ui/config";
import {
  Box,
  GluestackUIProvider,
  KeyboardAvoidingView,
} from "@gluestack-ui/themed";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
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
    <GluestackUIProvider config={config}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <KeyboardAvoidingView contentContainerStyle={{ flexGrow: 1 }}>
          <Box
            sx={{
              _web: {
                height: "100vh",
                overflow: "hidden",
              },
            }}
            height="100%"
          >
            <Stack screenOptions={{ headerShown: false }} />
          </Box>
        </KeyboardAvoidingView>
      </View>
    </GluestackUIProvider>
  );
}
