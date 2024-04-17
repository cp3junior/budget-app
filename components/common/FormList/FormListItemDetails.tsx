import { View } from "react-native";
import { colors } from "../../../lib/theme";
import Text from "../Text";

interface FormListItemDetailsProps {
  label: string;
  value: string;
}

const FormListItemDetails = ({ label, value }: FormListItemDetailsProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 20,
        height: 44,
      }}
    >
      <Text fontWeight="500">{label}</Text>
      <Text style={{ color: colors.grayLight }}>{value}</Text>
    </View>
  );
};

export default FormListItemDetails;
