import { Link } from "expo-router";
import { GestureResponderEvent, StyleSheet, TextStyle } from "react-native";
import { colors } from "../../lib/theme";
import Text from "./Text";

interface ButtonLinkProps {
  href: string;
  title: string;
  fontWeight?: TextStyle["fontWeight"];
  onPress?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => void;
  style?: TextStyle;
}

const ButtonLink = ({
  style,
  href,
  title,
  onPress,
  fontWeight,
}: ButtonLinkProps) => {
  const handlePress = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => {
    if (onPress) {
      e.preventDefault();
      onPress(e);
    }
  };

  return (
    <Link href={href} onPress={handlePress}>
      <Text
        style={{ ...styles.lnkTxt, ...Object.assign({}, style) }}
        fontWeight={fontWeight ?? "800"}
      >
        {title}
      </Text>
    </Link>
  );
};

const styles = StyleSheet.create({
  lnkTxt: {
    textAlign: "center",
    color: colors.blue,
  },
});

export default ButtonLink;
