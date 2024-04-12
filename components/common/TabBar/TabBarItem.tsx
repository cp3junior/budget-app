import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../../lib/theme";
import { useRouter, usePathname } from "expo-router";
import { ElementType } from "react";

export interface TabBarItemProps {
  href: string;
  type: "separator" | "tab";
  Icon?: ElementType;
  last?: boolean;
}

const TabBarItem = ({ type, href, Icon, last }: TabBarItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  if (type === "separator") {
    return <View style={styles.separator} />;
  }

  return (
    <View style={{ ...styles.icon, marginRight: last ? 0 : 10 }}>
      <TouchableOpacity onPress={() => router.navigate(href)}>
        <View>{Icon && <Icon isFocused={pathname === href} />}</View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    backgroundColor: colors.gray,
    width: 1,
    height: 20,
    marginLeft: 10,
    marginRight: 5,
  },
  icon: {
    marginLeft: 10,
  },
});

export default TabBarItem;
