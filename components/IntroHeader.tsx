import { View, StyleSheet } from "react-native";
import React from "react";
import Text from "./common/Text";
import Illustration from "./svg/Illustration";

interface IntroHeaderProps {
  small?: boolean;
}

const IntroHeader = ({ small }: IntroHeaderProps) => {
  return (
    <>
      <View style={styles.contTop}>
        <Text style={styles.txtTitle} fontWeight="900">
          💲Dazzle.
        </Text>
      </View>
      <View style={small ? styles.contMiddleSmall : styles.contMiddle}>
        <View style={styles.illuCont}>
          <View style={styles.illu}>
            <Illustration />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contTop: { paddingHorizontal: 15 },
  contMiddle: { flex: 1 },
  contMiddleSmall: { height: 150 },
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
});

export default IntroHeader;
