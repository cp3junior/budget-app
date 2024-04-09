import { Stack } from "expo-router";
import { colors } from "../../lib/theme";

const AppLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.darker },
      }}
    />
  );
};

export default AppLayout;
