import { ReactNode } from "react";
import { View } from "react-native";

interface FormListItemListProps {
  children: ReactNode;
}

const FormListItemList = ({ children }: FormListItemListProps) => {
  return (
    <View
      style={{
        paddingRight: 20,
        height: 44,
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
};

export default FormListItemList;
