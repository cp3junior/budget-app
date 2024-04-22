import { TouchableOpacity } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import { colors } from "../../lib/theme";

interface HeaderAddButtonProps {
  onPress: () => void;
}

const HeaderAddButton = ({ onPress }: HeaderAddButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <SFSymbol
        size={22}
        weight="regular"
        name="plus"
        colors={[colors.purple]}
      />
    </TouchableOpacity>
  );
};

export default HeaderAddButton;
