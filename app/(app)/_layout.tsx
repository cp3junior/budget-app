import { Stack } from "expo-router";
import { ScreenProps } from "expo-router/build/views/Screen";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { capitalize } from "../../lib/helpers";
import { colors } from "../../lib/theme";

const withTabsOptions: ScreenProps["options"] = {
  animation: "none",
  gestureEnabled: false,
  headerShown: true,
  headerBackVisible: false,
  headerBackTitleVisible: false,
  headerTitleStyle: { color: colors.white },
  headerTintColor: colors.purple,
  headerTransparent: true,
  headerBlurEffect: "dark",
};
const withHeaderOptions: ScreenProps["options"] = {
  headerShown: true,
  headerBackTitle: "Back",
  headerTitleStyle: { color: colors.white },
  headerTintColor: colors.purple,
  headerTransparent: true,
  headerBlurEffect: "dark",
};
const withModalOptions: ScreenProps["options"] = {
  presentation: "modal",
};

const tabsScreens = ["home", "budget", "transactions"];
const withHeaderScreens = [
  "profile",
  "about",
  "categories",
  "locations",
  "products",
];
const modalScreens = ["add-transaction", "profile-edit"];

const AppLayout = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.darker },
        }}
      >
        {/* Static screens, used for tabs */}
        {tabsScreens.map((name) => (
          <Stack.Screen
            key={name}
            name={name}
            options={{
              ...withTabsOptions,
              header: () => (
                <View
                  style={{ height: insets.top, backgroundColor: colors.darker }}
                />
              ),
            }}
          />
        ))}

        {/* With Header */}
        {withHeaderScreens.map((name) => (
          <Stack.Screen
            key={name}
            name={name}
            options={{
              ...withHeaderOptions,
              headerTitle: capitalize(name),
            }}
          />
        ))}

        {/* Modal Screens */}
        {modalScreens.map((name) => (
          <Stack.Screen key={name} name={name} options={withModalOptions} />
        ))}
      </Stack>
    </SafeAreaProvider>
  );
};

export default AppLayout;
