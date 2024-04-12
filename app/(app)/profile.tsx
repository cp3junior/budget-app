import { View } from "react-native";
import Text from "../../components/common/Text";
import withTabBar from "../../hoc/withTabBar";
import { Link } from "expo-router";

const Profile = () => {
  return (
    <View>
      <Text>Profile??</Text>
      <Link href="/test" style={{ marginTop: 40 }}>
        <Text>Test</Text>
      </Link>
    </View>
  );
};

const ProfileScreen = withTabBar(Profile);

export default ProfileScreen;
