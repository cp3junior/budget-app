import { View, StyleSheet } from "react-native";
import React from "react";
import Text from "./common/Text";
import Illustration from "./svg/Illustration";
import { colors } from "../lib/theme";

interface IntroHeaderProps {
  small?: boolean;
  text?: string;
}

const IntroHeader = ({ small, text }: IntroHeaderProps) => {
  return (
    <>
      {!small && (
        <View style={styles.contTop}>
          <Text style={styles.txtTitle} fontWeight="900">
            💲Dazzle.
          </Text>
        </View>
      )}
      <View style={small ? styles.contMiddleSmall : styles.contMiddle}>
        <View style={styles.illuCont}>
          <View style={styles.illu}>
            <Illustration />
          </View>
        </View>
      </View>
      {small && (
        <View style={styles.txtContainer}>
          <Text fontWeight="800" style={styles.txtW}>
            {text}
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  contTop: { paddingHorizontal: 15 },
  contMiddle: { flex: 1 },
  contMiddleSmall: { height: 180, marginTop: 50, marginBottom: 30 },
  txtTitle: {
    fontSize: 50,
    marginBottom: 20,
  },
  illuCont: {
    justifyContent: "center",
    alignItems: "center",
  },
  illu: {
    width: "70%",
  },
  txtContainer: {
    marginBottom: 0,
  },

  txtW: {
    fontSize: 20,
    color: colors.blue,
    textAlign: "center",
  },
});

export default IntroHeader;
