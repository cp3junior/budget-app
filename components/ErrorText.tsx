import { StyleSheet, View } from "react-native";
import React from "react";
import Text from "./common/Text";
import { colors } from "../lib/theme";
import { capitalize } from "../lib/helpers";

type ErrorTextProps = {
  message: string;
  isMessage?: boolean;
};
const ErrorText = ({ message, isMessage }: ErrorTextProps) => {
  return (
    <View style={styles.containerTextErr}>
      <Text
        style={{
          fontSize: isMessage ? 15 : 14,
          color: isMessage ? colors.grayLight : colors.redVivid,
          fontWeight: "600",
        }}
      >
        {capitalize(message || "")}
      </Text>
    </View>
  );
};

export default ErrorText;

const styles = StyleSheet.create({
  containerTextErr: {
    paddingLeft: 40,
    paddingRight: 20,
  },
});
