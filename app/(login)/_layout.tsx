import { router, Stack } from "expo-router";
import { colors } from "../../lib/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "../../hook/useAuthContext";
import { useEffect } from "react";

const LoginLayout = () => {
  const { currentUser } = useAuthContext();

  useEffect(() => {
    if (currentUser) {
      router.replace("/home");
    }
  }, [currentUser]);

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
