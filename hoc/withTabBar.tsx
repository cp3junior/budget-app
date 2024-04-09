import { ScrollView, View } from "react-native";
import TabBar from "../components/common/TabBar/TabBar";
import { ComponentType, ReactElement } from "react";

interface WithTabBarProps {}
interface WrappedComponentProps {}

const withTabBar = <P extends WrappedComponentProps>(
  WrappedComponent: ComponentType<P>
): React.FC<P & WithTabBarProps> => {
  return function WithTabBar(props: P & WithTabBarProps): ReactElement {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <WrappedComponent {...props} />
        </ScrollView>
        <TabBar />
      </View>
    );
  };
};

export default withTabBar;
