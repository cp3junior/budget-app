import { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../../lib/theme";

interface FormListContainerProps {
  children: ReactNode;
  footer?: ReactNode;
  style?: ViewStyle;
}

const FormListContainer = ({
  children,
  footer,
  style,
}: FormListContainerProps) => {
  return (
    <View style={{ ...styles.formContainer, ...style }}>
      <View style={styles.formContent}>{children}</View>
      {footer}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formContent: {
    flex: 1,
    backgroundColor: colors.dark,
    borderRadius: 10,
    paddingLeft: 20,
  },
});

export default FormListContainer;
