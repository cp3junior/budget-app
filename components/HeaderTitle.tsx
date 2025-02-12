import { Spinner } from "@gluestack-ui/themed";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SFSymbol from "sweet-sfsymbols";
import { colors } from "../lib/theme";

interface HeaderTitleProps {
  title: string;
  hasButton?: boolean;
  onPressButton?: () => void;
  isLoading?: boolean;
}
const HeaderTitle = ({
  title,
  hasButton = false,
  onPressButton,
  isLoading = false,
}: HeaderTitleProps) => {
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    onPressButton && onPressButton();
  };

  return (
    <BlurView
      tint="dark"
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Text style={styles.textTitle}>{title}</Text>
      {hasButton && (
        <View style={styles.addBtn}>
          {isLoading ? (
            <Spinner color={colors.blue} />
          ) : (
            <TouchableOpacity onPress={handlePress}>
              <SFSymbol
                size={22}
                weight="regular"
                name="plus"
                colors={[colors.blue]}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  textTitle: {
    flex: 1,
    fontSize: 34,
    color: colors.white,
    fontWeight: "900",
    marginLeft: 20,
    marginTop: 2,
    marginBottom: 10,
  },
  addBtn: {
    marginRight: 20,
  },
});

export default HeaderTitle;
