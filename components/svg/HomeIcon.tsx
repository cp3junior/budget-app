import { Path, Svg } from "react-native-svg";
import { colors } from "../../lib/theme";
import { TAB_ICON_SIZE } from "../../lib/constant";

const HomeIcon = ({ isFocused }: TabIconProps) => {
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
        d="M8 15s1.6 2 4 2 4-2 4-2m-13-.4v-2.47c0-1.149 0-1.723.148-2.252a4 4 0 0 1 .636-1.3c.327-.442.78-.794 1.687-1.5l2.6-2.022c1.405-1.093 2.108-1.64 2.884-1.85a4 4 0 0 1 2.09 0c.776.21 1.479.757 2.884 1.85l2.6 2.022c.907.706 1.36 1.058 1.687 1.5.29.391.505.832.636 1.3.148.53.148 1.104.148 2.252v2.47c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 21 16.84 21 14.6 21H9.4c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C3 17.96 3 16.84 3 14.6Z"
      />
    </Svg>
  );
};

export default HomeIcon;
