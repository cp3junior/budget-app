import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Box,
  GluestackUIProvider,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
} from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GluestackUIProvider config={config}>
        <KeyboardAvoidingView contentContainerStyle={{ flexGrow: 1 }}>
          <Box
            sx={{
              _web: {
                height: "100vh",
                overflow: "hidden",
              },
            }}
            height="100%"
          >
            <StatusBar translucent backgroundColor="transparent" />
            <ScrollView
              bounces={false}
              flex={1}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="always"
            >
              {children}
            </ScrollView>
          </Box>
        </KeyboardAvoidingView>
      </GluestackUIProvider>
    </SafeAreaView>
  );
};

export default Layout;
