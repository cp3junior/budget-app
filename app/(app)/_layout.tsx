import { Stack } from "expo-router";
import { colors } from "../../lib/theme";

const AppLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.darker },
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          animation: "none",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="add-transaction"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          animation: "none",
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
};

export default AppLayout;
