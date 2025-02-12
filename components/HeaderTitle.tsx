import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import SFSymbol from "sweet-sfsymbols";
import { colors } from "../lib/theme";
import { Spinner } from "@gluestack-ui/themed";

interface HeaderTitleProps {
  title: string;
  hasButton?: boolean;
  onPressButton?: () => void;
  isLoading?: boolean;
}
const HeaderTitle = ({
  title,
  hasButton,
  onPressButton,
  isLoading = false,
}: HeaderTitleProps) => {
  const handlePress = () => {
    onPressButton && onPressButton();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>{title}</Text>
      {hasButton && isLoading ? (
        <Spinner color={colors.blue} />
      ) : (
        <TouchableOpacity style={styles.addBtn} onPress={handlePress}>
          <SFSymbol
            size={22}
            weight="regular"
            name="plus"
            colors={[colors.blue]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 36,
    alignItems: "center",
    marginBottom: 10,
  },
  textTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    color: colors.white,
    fontWeight: "900",
  },
  addBtn: {
    position: "absolute",
    right: 0,
  },
});

export default HeaderTitle;
