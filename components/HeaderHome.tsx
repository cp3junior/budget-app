import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../hook/useAppContext";
import { colors } from "../lib/theme";
import ProfileImage from "./common/ProfileImage";
import Text from "./common/Text";

const HeaderHome = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAppContext();

  const [showBlur, setShowBlur] = useState(false);

  if (!user) return null;

  const navigateToProfileScreen = () => {
    router.navigate("/profile");
  };

  return (
    <View onLayout={() => setShowBlur(true)}>
      {showBlur && (
        <BlurView tint="dark" style={{ paddingTop: insets.top }}>
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
        </BlurView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 20,
    marginTop: -10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 200,
  },
  userImageContainer: {
    padding: 2,
    borderWidth: 2,
    borderColor: colors.purple,
    borderRadius: 200,
  },
  txtName: { fontSize: 16, fontWeight: "600" },
  txtTrack: { fontSize: 22, fontWeight: "900", color: colors.grayLight },
});

export default HeaderHome;
