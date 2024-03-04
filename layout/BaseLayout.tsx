import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ViewStyle } from "react-native";
import { StatusBar } from "@gluestack-ui/themed";

interface BaseLayoutProps {
  children: ReactNode;
  bg?: string;
  style?: ViewStyle;
  isLight?: boolean;
}

const BaseLayout = ({ bg, children, style, isLight }: BaseLayoutProps) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bg ?? "transparent",
        ...Object.assign({}, style),
      }}
    >
      <StatusBar barStyle={isLight ? "dark-content" : "light-content"} />
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
    </View>
  );
};

export default BaseLayout;
