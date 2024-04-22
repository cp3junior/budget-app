import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import { colors } from "../../../lib/theme";
import Text from "../Text";

interface FormListButtonLinkProps {
  label: string;
  href: string;
  value?: string;
  color?: string;
  hasIcon?: boolean;
  hasExternal?: boolean;
  onPress?: () => void;
}

const FormListButtonLink = ({
  label,
  href,
  color,
  hasIcon = true,
  hasExternal,
  value,
  onPress,
}: FormListButtonLinkProps) => {
  const router = useRouter();

  const handleNavigate = () => {
    if (onPress) {
      onPress();
    } else {
      router.navigate(href);
    }
  };
  return (
    <TouchableOpacity onPress={handleNavigate} style={styles.container}>
      <Text
        fontWeight="500"
        style={{ ...styles.textStyle, color: color ? color : colors.white }}
      >
        {label}
      </Text>
      {hasIcon && (
        <View>
          <SFSymbol size={12} name="chevron.right" colors={[colors.white]} />
        </View>
      )}
      {hasExternal && (
        <View style={styles.externatContainer}>
          <Text style={styles.externalText}>{value}</Text>
          <SFSymbol
            weight="thin"
            size={15}
            name="arrow.up.forward.square"
            colors={[colors.grayLight]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 44,
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 20,
  },
  textStyle: {
    flex: 1,
    paddingRight: 10,
  },
  externatContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  externalText: {
    color: colors.grayLight,
    marginRight: 6,
  },
});

export default FormListButtonLink;
