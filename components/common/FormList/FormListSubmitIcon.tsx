import { ArrowRightIcon, InputIcon } from "@gluestack-ui/themed";
import { View, StyleSheet } from "react-native";
import { colors } from "../../../lib/theme";

const FormListSubmitIcon = () => {
  return (
    <View style={styles.iconContainer}>
      <InputIcon size="lg" as={ArrowRightIcon} color={colors.blue} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    borderColor: colors.blue,
    borderWidth: 1,
    borderRadius: 30,
    padding: 2,
  },
});

export default FormListSubmitIcon;
