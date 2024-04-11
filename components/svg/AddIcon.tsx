import { Path, Svg } from "react-native-svg";
import { colors } from "../../lib/theme";
import { TAB_ICON_SIZE } from "../../lib/constant";

const AddIcon = ({ isFocused }: TabIconProps) => {
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
        d="M6 12h12m-6-6v12"
      />
    </Svg>
  );
};

export default AddIcon;
