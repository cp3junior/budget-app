import { Stack } from "expo-router";
import { colors } from "../../lib/theme";

const LoginLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.darker },
      }}
    />
  );
};

export default LoginLayout;
