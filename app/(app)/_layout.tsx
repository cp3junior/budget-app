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
      {/* Static screens, used for tabs */}
      <Stack.Screen
        name="home"
        options={{
          animation: "none",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="budget"
        options={{
          animation: "none",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="transactions"
        options={{
          animation: "none",
          gestureEnabled: false,
        }}
      />

      {/* Modal Screens */}
      <Stack.Screen
        name="add-transaction"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default AppLayout;
