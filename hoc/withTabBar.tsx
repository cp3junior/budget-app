import { ComponentType, ReactElement } from "react";
import { ScrollView, View } from "react-native";
import TabBar from "../components/common/TabBar/TabBar";

interface WithTabBarProps {}
interface WrappedComponentProps {}

const withTabBar = <P extends WrappedComponentProps>(
  WrappedComponent: ComponentType<P>
): React.FC<P & WithTabBarProps> => {
  return function WithTabBar(props: P & WithTabBarProps): ReactElement {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ paddingBottom: 90 }}>
            <WrappedComponent {...props} />
          </View>
        </ScrollView>
        <TabBar />
      </View>
    );
  };
};

export default withTabBar;
