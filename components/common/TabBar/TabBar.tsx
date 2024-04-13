import { StyleSheet, View } from "react-native";
import { colors } from "../../../lib/theme";
import AddIcon from "../../svg/AddIcon";
import HomeIcon from "../../svg/HomeIcon";
import PieIcon from "../../svg/PieIcon";
import TabBarItem, { TabBarItemProps } from "./TabBarItem";
import DollarIcon from "../../svg/DollarIcon";

const tabItems: TabBarItemProps[] = [
  {
    Icon: HomeIcon,
    href: "/home",
    type: "tab",
  },
  {
    Icon: PieIcon,
    href: "/budget",
    type: "tab",
  },
  {
    Icon: DollarIcon,
    href: "/transactions",
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
    last: true,
  },
];

const TabBar = () => {
  return (
    <View style={styles.fixedContainer}>
      <View style={styles.container}>
        <View style={styles.iconContainers}>
          {tabItems.map((item) => (
            <TabBarItem key={item.href} {...item} />
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
    bottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 68,
    backgroundColor: colors.dark,
    borderRadius: 50,
    paddingHorizontal: 14,
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
