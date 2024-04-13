import { Button as ButtonMUI } from "@gluestack-ui/themed";
import Text from "./Text";
import { colors } from "../../lib/theme";
import { GestureResponderEvent, StyleSheet } from "react-native";

interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  title: string;
}

const Button = ({ onPress, title }: ButtonProps) => {
  return (
    <ButtonMUI
      backgroundColor={colors.white}
      $active-backgroundColor="$trueGray400"
      action="secondary"
      size="md"
      style={styles.btn}
      onPress={onPress}
    >
      <Text fontWeight="700" style={styles.btnTxt}>
        {title}
      </Text>
    </ButtonMUI>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 5,
  },
  btnTxt: {
    color: colors.darker,
  },
});

export default Button;
