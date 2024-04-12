import { ButtonText } from "@gluestack-ui/themed";
import { Button } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../lib/theme";

interface ToggleButtonProps {
  items: ToggleItem[];
}

const ToggleButton = ({ items }: ToggleButtonProps) => {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (items.length > 0) {
      const firstItem = items[0].value;
      setActive(firstItem);
    }
  }, []);

  return (
    <View style={styles.container}>
      {items.map(({ value, label, activeBg }) => {
        const activeBackground = activeBg ?? colors.white;

        return (
          <Button
            style={{
              ...styles.button,
              backgroundColor:
                active === value ? activeBackground : "transparent",
            }}
            size="xs"
            key={value}
            onPress={() => setActive(value)}
          >
            <ButtonText
              style={{
                color: active === value ? colors.black : colors.white,
              }}
            >
              {label}
            </ButtonText>
          </Button>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: colors.gray,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 10,
  },
  button: { flex: 1, borderRadius: 5 },
});

export default ToggleButton;
