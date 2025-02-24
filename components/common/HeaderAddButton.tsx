import { Spinner } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import { colors } from "../../lib/theme";

interface HeaderAddButtonProps {
  onPress: () => void;
  isLoading: boolean;
}

const HeaderAddButton = ({ onPress, isLoading }: HeaderAddButtonProps) => {
  if (isLoading) return <Spinner color={colors.purple} />;

  return (
    <TouchableOpacity onPress={onPress}>
      <SFSymbol size={22} weight="regular" name="plus" colors={[colors.blue]} />
    </TouchableOpacity>
  );
};

export default HeaderAddButton;
