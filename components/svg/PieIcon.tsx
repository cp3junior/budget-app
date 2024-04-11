import { Path, Svg } from "react-native-svg";
import { colors } from "../../lib/theme";
import { TAB_ICON_SIZE } from "../../lib/constant";

const PieIcon = ({ isFocused }: TabIconProps) => {
  return (
    <Svg
      width={TAB_ICON_SIZE}
      height={TAB_ICON_SIZE}
      fill="none"
      viewBox="0 0 24 24"
    >
      <Path
        stroke={isFocused ? colors.blue : colors.white}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19.95 17.95 15 13h7a6.978 6.978 0 0 1-2.05 4.95ZM20 10a7 7 0 0 0-7-7v7h7ZM2 12a8 8 0 0 0 13.657 5.657L10 12V4a8 8 0 0 0-8 8Z"
      />
    </Svg>
  );
};

export default PieIcon;
