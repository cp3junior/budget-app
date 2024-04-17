import { ReactNode } from "react";
import { ScrollView, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SafeContainerProps {
  children: ReactNode;
  footerView?: ReactNode;
  style?: ViewStyle;
  hasHeader?: boolean;
}

const SafeContainer = ({
  children,
  style,
  hasHeader,
  footerView,
}: SafeContainerProps) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        ...Object.assign({}, style),
      }}
      edges={["right", "left", "top"]}
    >
      <ScrollView
        style={{
          paddingTop: hasHeader ? 50 : 0,
        }}
      >
        {children}
      </ScrollView>

      {footerView}
    </SafeAreaView>
  );
};

export default SafeContainer;
