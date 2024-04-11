import { StyleSheet, View } from "react-native";
import { colors } from "../../../lib/theme";
import AddIcon from "../../svg/AddIcon";
import HomeIcon from "../../svg/HomeIcon";
import PieIcon from "../../svg/PieIcon";
import TabBarItem, { TabBarItemProps } from "./TabBarItem";

const tabItems: TabBarItemProps[] = [
  {
    Icon: HomeIcon,
    href: "/home",
    type: "tab",
  },
  {
    Icon: PieIcon,
    href: "/about",
    type: "tab",
  },
  {
    href: "",
    type: "separator",
  },
  {
    Icon: AddIcon,
    href: "/add-transaction",
    type: "tab",
  },
];

const TabBar = () => {
  return (
    <View style={styles.fixedContainer}>
      <View style={styles.container}>
        <View style={styles.iconContainers}>
          {tabItems.map((item) => (
            <TabBarItem
              key={item.href}
              type={item.type}
              href={item.href}
              Icon={item.Icon}
            />
          ))}
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
