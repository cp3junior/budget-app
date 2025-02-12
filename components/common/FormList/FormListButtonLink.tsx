import { useRouter } from "expo-router";
import { StyleSheet, TextStyle, TouchableOpacity, View } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import { colors } from "../../../lib/theme";
import Text from "../Text";
import { ReactNode } from "react";

interface FormListButtonLinkProps {
  label: string;
  href?: string;
  value?: string;
  color?: string;
  hasIcon?: boolean;
  hasExternal?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  footerNode?: ReactNode;
  textStyle?: TextStyle;
}

const FormListButtonLink = ({
  label,
  href,
  color,
  hasIcon = true,
  hasExternal,
  value,
  onPress,
  onLongPress,
  footerNode,
  textStyle,
}: FormListButtonLinkProps) => {
  const router = useRouter();

  const handleNavigate = () => {
    if (onPress) {
      onPress();
    } else {
      router.navigate(href || "/");
    }
  };
  return (
    <TouchableOpacity
      onPress={handleNavigate}
      onLongPress={onLongPress}
      style={styles.container}
    >
      <View style={styles.containerTop}>
        <Text
          fontWeight={textStyle?.fontWeight || "500"}
          style={{
            ...styles.textStyle,
            color: color ? color : colors.white,
            ...textStyle,
          }}
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
      </View>
      {footerNode && <View>{footerNode}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    flex: 1,
    paddingRight: 20,
    paddingVertical: 10,
    justifyContent: "center",
  },
  containerTop: {
    alignItems: "center",
    flexDirection: "row",
  },
  textStyle: {
    paddingRight: 10,
    flex: 1,
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
