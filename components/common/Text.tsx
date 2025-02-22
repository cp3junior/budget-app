import { ReactNode } from "react";
import { Text as RNText, TextStyle } from "react-native";
import { colors } from "../../lib/theme";

interface TextProps {
  children: ReactNode;
  style?: TextStyle;
}

const fontMapping = {
  "100": "ManropeExtraLight",
  "200": "ManropeLight",
  "300": "ManropeLight",
  "400": "ManropeRegular",
  normal: "ManropeRegular",
  "500": "ManropeMedium",
  "600": "ManropeSemiBold",
  "700": "ManropeBold",
  "800": "ManropeExtraBold",
  "900": "ManropeExtraBold",
  bold: "ManropeExtraBold",
};

const DEFAULT_SIZE = 17;
const DEFAULT_COLOR = colors.white;

const Text = ({ children, style }: TextProps) => {
  const fontWeight = style?.fontWeight || "normal";
  return (
    <RNText
      style={{
        fontFamily: fontWeight
          ? fontMapping?.[fontWeight] || "ManropeRegular"
          : "ManropeRegular",
        fontSize: DEFAULT_SIZE,
        color: DEFAULT_COLOR,
        ...Object.assign({}, style),
      }}
    >
      {children}
    </RNText>
  );
};

export default Text;
