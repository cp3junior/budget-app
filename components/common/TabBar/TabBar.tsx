import { StyleSheet, View } from "react-native";
import Text from "../Text";
import HomeIcon from "../../svg/HomeIcon";
import PieIcon from "../../svg/PieIcon";
import AddIcon from "../../svg/AddIcon";
import { Link } from "expo-router";
import { colors } from "../../../lib/theme";

const TabBar = () => {
  return (
    <View style={styles.fixedContainer}>
      <View style={styles.container}>
        <View style={styles.iconContainers}>
          <View style={styles.icon}>
            <Link href="/home">
              <HomeIcon />
            </Link>
          </View>
          <View style={styles.icon}>
            <Link href="/about">
              <PieIcon />
            </Link>
          </View>
          <View style={styles.separator} />
          <View style={styles.icon}>
            <Link href="/home">
              <AddIcon />
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    backgroundColor: colors.gray,
    width: 1,
    height: 20,
    marginLeft: 10,
    marginRight: 5,
  },
  icon: {
    marginHorizontal: 10,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 65,
    backgroundColor: colors.dark,
    borderRadius: 50,
    paddingHorizontal: 18,
    borderColor: colors.gray,
    borderWidth: 0.4,
  },
  iconContainers: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TabBar;
