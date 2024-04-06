import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, View, ViewStyle } from "react-native";
import { KeyboardAvoidingView, StatusBar } from "@gluestack-ui/themed";
import { colors } from "../lib/theme";

interface BaseLayoutProps {
  children: ReactNode;
  bg?: string;
  style?: ViewStyle;
  isLight?: boolean;
}

const BaseLayout = ({ bg, children, style, isLight }: BaseLayoutProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: bg ?? colors.darker,
          ...Object.assign({}, style),
        }}
      >
        <StatusBar barStyle={isLight ? "dark-content" : "light-content"} />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>{children}</View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BaseLayout;
