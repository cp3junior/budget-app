import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import FormListButtonLink from "../../components/common/FormList/FormListButtonLink";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import ProfileImage from "../../components/common/ProfileImage";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import { useAppContext } from "../../hook/useAppContext";
import { logOut } from "../../lib/firebaseAuth";
import { colors } from "../../lib/theme";

const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useAppContext();

  if (!user) return null;

  const navigateToProfileEditScreen = () => {
    router.navigate("/profile-edit");
  };

  const handleLogout = async () => {
    await logOut();
  };

  return (
    <SafeContainer hasHeader>
      <FormListContainer style={styles.containerStyle}>
        <TouchableOpacity
          onPress={navigateToProfileEditScreen}
          style={styles.profileContainerStyle}
        >
          <View style={styles.userImageContainer}>
            <ProfileImage style={styles.userImage} />
          </View>
          <View style={styles.detContainer}>
            <View style={styles.flex}>
              <Text style={styles.txtName}>
                {user.firstName} {user.lastName}
              </Text>
              <Text>Edit your profile</Text>
            </View>
            <View>
              <SFSymbol
                size={12}
                name="chevron.right"
                colors={[colors.white]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </FormListContainer>
      <FormListContainer style={styles.containerStyle}>
        <FormListButtonLink label="Account sharing" href="/account-sharing" />
      </FormListContainer>
      <FormListContainer style={styles.containerStyle}>
        <FormListButtonLink label="Locations" href="/locations" />
        <FormListSeparator />
        <FormListButtonLink label="Products" href="/products" />
        <FormListSeparator />
        <FormListButtonLink label="List of Categories" href="/categories" />
      </FormListContainer>
      <FormListContainer style={{ ...styles.containerStyle, marginBottom: 20 }}>
        <FormListButtonLink
          label="About"
          href="/about"
          hasIcon={false}
          color={colors.blue}
        />
      </FormListContainer>
      <FormListContainer style={styles.containerStyle}>
        <FormListButtonLink
          label="Logout"
          hasIcon={false}
          color={colors.redVivid}
          onPress={handleLogout}
        />
      </FormListContainer>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  txtName: {
    fontSize: 22,
    fontWeight: "900",
  },
  container: {
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  txtHeader: {
    fontSize: 34,
    lineHeight: 36,
    marginBottom: 20,
  },
  containerStyle: {
    padding: 0,
    flex: 1,
    marginBottom: 30,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
  userImageContainer: {
    padding: 2,
    borderWidth: 2,
    borderColor: colors.purple,
    borderRadius: 200,
  },
  profileContainerStyle: {
    flexDirection: "row",
    paddingVertical: 8,
    alignItems: "center",
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  detContainer: {
    paddingLeft: 15,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});

export default ProfileScreen;
