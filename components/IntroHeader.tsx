import { View, StyleSheet } from "react-native";
import React from "react";
import Text from "./common/Text";
import Illustration from "./svg/Illustration";

const IntroHeader = () => {
  return (
    <>
      <View style={styles.contTop}>
        <Text style={styles.txtTitle} fontWeight="900">
          💲Dazzle.
        </Text>
      </View>
      <View style={styles.contMiddle}>
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
