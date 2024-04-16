import { View, StyleSheet, ViewStyle } from "react-native";
import { ReactNode } from "react";

interface FormListContentProps {
  children: ReactNode;
  style?: ViewStyle;
}

const FormListContent = ({ children, style }: FormListContentProps) => {
  return (
    <View style={{ ...styles.listItemContainer, ...Object.assign({}, style) }}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: "row",
    height: 44,
    alignItems: "center",
    paddingRight: 20,
  },
});

export default FormListContent;
