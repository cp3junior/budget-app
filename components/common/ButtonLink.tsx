import { Link } from "expo-router";
import Text from "./Text";
import { StyleSheet, TextStyle } from "react-native";
import { colors } from "../../lib/theme";

interface ButtonLinkProps {
  href: string;
  title: string;
  style?: TextStyle;
}

const ButtonLink = ({ style, href, title }: ButtonLinkProps) => {
  return (
    <Link href={href}>
      <Text
        style={{ ...styles.lnkTxt, ...Object.assign({}, style) }}
        fontWeight="800"
      >
        {title}
      </Text>
    </Link>
  );
};

const styles = StyleSheet.create({
  lnkTxt: {
    textDecorationLine: "underline",
    textAlign: "center",
    color: colors.blue,
  },
});

export default ButtonLink;
