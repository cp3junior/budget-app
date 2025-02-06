import Svg, { Path } from "react-native-svg";
import { TAB_ICON_SIZE } from "../../lib/constant";
import { colors } from "../../lib/theme";

const DollarTransactionIcon = ({ isFocused }: TabIconProps) => {
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
        d="M4 9V7.2c0-1.1201 0-1.6802.218-2.108a1.9999 1.9999 0 0 1 .874-.874C5.5198 4 6.08 4 7.2 4h9.6c1.1201 0 1.6802 0 2.108.218.3763.1917.6823.4977.874.874C20 5.5198 20 6.08 20 7.2v9.6c0 1.1201 0 1.6802-.218 2.108a1.9996 1.9996 0 0 1-.874.874C18.4802 20 17.9201 20 16.8 20h-6.3m.5-4h6m-9-5 3-2v3l6-5m0 0h-3m3 0v3M7 14.5c-.5-.124-1.315-.1286-2-.124-.229.0015-.0906-.0082-.4 0-.8074.0252-1.5983.3608-1.6 1.3115C2.9983 16.7004 4 17 5 17s2 .2312 2 1.3125c0 .8126-.8075 1.1687-1.8139 1.2866-.8 0-1.1861.0259-2.1861-.0991m2 .5v1m0-8v1"
      />
    </Svg>
  );
};

export default DollarTransactionIcon;
