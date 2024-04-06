import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import Text from "../components/common/Text";
import BaseLayout from "../layout/BaseLayout";
import IntroHeader from "../components/IntroHeader";
import ButtonLink from "../components/common/ButtonLink";
import Button from "../components/common/Button";

export default function Page() {
  const handleNavigate = () => {
    router.push("/sign-in");
  };

  return (
    <BaseLayout style={styles.container}>
      <IntroHeader />
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
          <Button onPress={handleNavigate} title="Sign In" />
        </View>
        <View style={{ flex: 1 }}>
          <ButtonLink href="/sign-up" title="Sign Up" />
        </View>
      </View>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  contBottom: { paddingHorizontal: 15, marginTop: 20 },
  txtCatch: { fontSize: 35, marginBottom: 10 },
  txtCatchDet: { fontSize: 35 },

  btnGroupCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 15,
    marginTop: 30,
    marginBottom: 10,
  },
});
