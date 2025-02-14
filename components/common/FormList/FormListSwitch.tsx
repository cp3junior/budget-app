import { Switch } from "@gluestack-ui/themed";
import { StyleSheet, View } from "react-native";
import Text from "../Text";

interface FormListSwitchProps {
  label: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
}

const FormListSwitch = ({
  label,
  onValueChange,
  value,
}: FormListSwitchProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        trackColor={{ false: "#444", true: "#34C759" }}
        ios_backgroundColor="#444"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 44,
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },
  label: {
    fontWeight: "800",
  },
});

export default FormListSwitch;
