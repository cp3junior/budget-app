import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ProfileImage from "../../components/common/ProfileImage";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import withTabBar from "../../hoc/withTabBar";
import { useAppContext } from "../../hook/useAppContext";
import { colors } from "../../lib/theme";

const Home = () => {
  const router = useRouter();
  const { user } = useAppContext();

  if (!user) return null;

  const navigateToProfileScreen = () => {
    router.navigate("/profile");
  };

  return (
    <SafeContainer>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.txtName}>Hi, {user.firstName}!</Text>
          <Text style={styles.txtTrack}>Track, Plan, Save</Text>
        </View>
        <TouchableOpacity
          onPress={navigateToProfileScreen}
          style={styles.userImageContainer}
        >
          <ProfileImage style={styles.userImage} />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={{ textAlign: "center" }}>========================</Text>
        <Text>Graph</Text>
        <Text>How much u spent today, daily spending graph?</Text>

        <Text>
          Info about current months budget , money left to spend, money spent
        </Text>
        <Text style={{ textAlign: "center" }}>========================</Text>
        <Text>Income total this month</Text>
        <Text style={{ textAlign: "center" }}>========================</Text>
        <Text>Percentage budget left, list</Text>
        <Text>Upcoming bills</Text>
        <Text style={{ textAlign: "center" }}>========================</Text>
        <Text>Month spending transactions (last 10 seeall)</Text>
        <Text style={{ textAlign: "center" }}>========================</Text>
      </View>
      <Text style={{ color: "red" }}>Home Page???</Text>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userImageContainer: {
    padding: 2,
    borderWidth: 2,
    borderColor: colors.purple,
    borderRadius: 200,
  },
  txtName: { fontSize: 15 },
  txtTrack: { fontSize: 24, fontWeight: "800" },
});

const HomeScreen = withTabBar(Home);

export default HomeScreen;
