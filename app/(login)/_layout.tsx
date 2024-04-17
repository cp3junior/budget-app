import { Stack } from "expo-router";
import { colors } from "../../lib/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.darker },
        }}
      />
    </SafeAreaView>
  );
};

export default LoginLayout;
