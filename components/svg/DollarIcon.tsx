import { Path, Svg } from "react-native-svg";
import { colors } from "../../lib/theme";
import { TAB_ICON_SIZE } from "../../lib/constant";

const DollarIcon = ({ isFocused }: TabIconProps) => {
  return (
    <Svg
      width={TAB_ICON_SIZE}
      height={TAB_ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        stroke={isFocused ? colors.blue : colors.white}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 8H4m2 8H4m2-4H3m4-7.484a9 9 0 1 1 0 14.969M14 9.5c-.5-.124-1.315-.129-2-.124m0 0c-.23.001-.09-.008-.4 0-.807.025-1.598.36-1.6 1.311C9.998 11.7 11 12 12 12s2 .231 2 1.312c0 .813-.807 1.17-1.814 1.287H12m0-5.223V8m0 6.6c-.68.002-1.08.015-2-.1m2 .1V16"
      />
    </Svg>
  );
};

export default DollarIcon;
