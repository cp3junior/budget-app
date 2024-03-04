import { View, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import Text from "../components/common/Text";
import BaseLayout from "../layout/BaseLayout";
import { colors } from "../lib/theme";
import { Button } from "@gluestack-ui/themed";
import Illustration from "../components/svg/Illustration";

export default function Page() {
  const handleNavigate = () => {
    router.push("/sign-in");
  };

  return (
    <BaseLayout bg={colors.darker} style={styles.container}>
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

      <View style={styles.contBottom}>
        <Text style={styles.txtCatch} fontWeight="300">
          <Text style={styles.txtCatchDet} fontWeight="700">
            Take Control
          </Text>{" "}
          of Your Finances Today!
        </Text>
        <Text fontWeight="300">
          With our app, you can easily track your income and expenses, set
          financial goals, and make informd decisions about your money.
        </Text>
      </View>
      <View style={styles.btnGroupCont}>
        <View style={{ flex: 1 }}>
          <Button
            backgroundColor={colors.white}
            $active-backgroundColor="$trueGray400"
            action="secondary"
            size="xl"
            style={styles.btn}
            onPress={handleNavigate}
          >
            <Text fontWeight="700" style={styles.btnTxt}>
              Sign In
            </Text>
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          <Link href="/sign-up">
            <Text style={styles.lnkTxt} fontWeight="800">
              Sign Up
            </Text>
          </Link>
        </View>
      </View>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  contTop: { paddingHorizontal: 15 },
  contMiddle: { flex: 1 },
  contBottom: { paddingHorizontal: 15, marginTop: 20 },
  txtTitle: {
    fontSize: 50,
    marginBottom: 20,
  },
  txtCatch: { fontSize: 35, marginBottom: 10 },
  txtCatchDet: { fontSize: 35 },
  btn: {
    borderRadius: 15,
  },
  btnGroupCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 15,
    marginTop: 30,
    marginBottom: 10,
  },
  btnTxt: {
    color: colors.darker,
  },
  lnkTxt: {
    textDecorationLine: "underline",
    textAlign: "center",
    color: colors.blue,
  },
  illuCont: {
    justifyContent: "center",
    alignItems: "center",
  },
  illu: {
    width: "70%",
  },
});
