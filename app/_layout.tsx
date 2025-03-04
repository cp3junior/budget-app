import { config } from "@gluestack-ui/config";
import { GluestackUIProvider, StatusBar } from "@gluestack-ui/themed";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { View } from "react-native";
import AppEntry from "../components/AppEntry";
import { AuthContextProvider } from "../context/AuthContextProvider";
import { colors } from "../lib/theme";
import { AppContextProvider } from "../context/AppContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ManropeExtraLight: require("../assets/fonts/Manrope-ExtraLight.ttf"),
    ManropeLight: require("../assets/fonts/Manrope-Light.ttf"),
    ManropeRegular: require("../assets/fonts/Manrope-Regular.ttf"),
    ManropeMedium: require("../assets/fonts/Manrope-Medium.ttf"),
    ManropeSemiBold: require("../assets/fonts/Manrope-SemiBold.ttf"),
    ManropeBold: require("../assets/fonts/Manrope-Bold.ttf"),
    ManropeExtraBold: require("../assets/fonts/Manrope-ExtraBold.ttf"),
    FjallaOne: require("../assets/fonts/FjallaOne-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  console.log("RENDER");

  return (
    <GluestackUIProvider colorMode="dark" config={config}>
      <AuthContextProvider>
        <AppContextProvider>
          <QueryClientProvider client={queryClient}>
            <View
              style={{ flex: 1, backgroundColor: colors.darker }}
              onLayout={onLayoutRootView}
            >
              <StatusBar barStyle="light-content" />
              <AppEntry />
            </View>
          </QueryClientProvider>
        </AppContextProvider>
      </AuthContextProvider>
    </GluestackUIProvider>
  );
}
