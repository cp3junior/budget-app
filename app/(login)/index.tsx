import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import IntroHeader from "../../components/IntroHeader";
import Button from "../../components/common/Button";
import ButtonLink from "../../components/common/ButtonLink";
import Text from "../../components/common/Text";

export default function Page() {
  const handleNavigate = () => {
    router.push("/sign-in");
  };

  return (
    <View style={styles.container}>
      <IntroHeader />
      <View style={styles.contBottom}>
        <Text style={styles.txtCatchDet}>Take Control</Text>
        <Text style={styles.txtCatch}>of Your Finances Today!</Text>
        <Text style={{ fontWeight: "300" }}>
          With our app, you can easily track your income and expenses, set
          financial goals, and make informed decisions about your money.
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flex: 1,
  },
  contBottom: { paddingHorizontal: 15, marginTop: 20 },
  txtCatch: { fontSize: 35, marginBottom: 10, fontWeight: "300" },
  txtCatchDet: { fontSize: 35, fontWeight: "700" },

  btnGroupCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 15,
    marginTop: 30,
    marginBottom: 10,
  },
});
