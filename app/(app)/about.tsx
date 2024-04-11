import { View } from "react-native";
import Text from "../../components/common/Text";
import withTabBar from "../../hoc/withTabBar";
import { Link } from "expo-router";

const About = () => {
  return (
    <View>
      <Text>About??</Text>
      <Link href="/test" style={{ marginTop: 40 }}>
        <Text>Test</Text>
      </Link>
    </View>
  );
};

const AboutScreen = withTabBar(About);

export default AboutScreen;
