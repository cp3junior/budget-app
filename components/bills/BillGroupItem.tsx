import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { Fragment } from "react";
import Text from "../common/Text";
import { colors } from "../../lib/theme";
import FormListContainer from "../common/FormList/FormListContainer";
import SFSymbol from "sweet-sfsymbols";
import { Progress, ProgressFilledTrack } from "@gluestack-ui/themed";
import FormListSeparator from "../common/FormList/FormListSeparator";
import { useRouter } from "expo-router";
const BillGroupItem = () => {
  const router = useRouter();

  const arrays = new Array(3).fill(0);

  const navigateToDetails = (id: string) => {
    router.push({
      pathname: "/expense-details",
      params: { billsId: id },
    });
  };

  return (
    <FormListContainer style={styles.container}>
      <View style={styles.containerTop}>
        <View style={styles.containerTopIcon}>
          <SFSymbol
            weight="medium"
            size={21}
            name={"creditcard"}
            colors={[colors.grayLight]}
          />
        </View>
        <View style={styles.containerTopText}>
          <Text style={styles.containerTopTextLabel}>Transportation</Text>
          <Text style={styles.containerTopTextPercent}>30% of budget</Text>
        </View>
        <View style={styles.containerTopAmount}>
          <Text style={styles.containerTopAmountText}>$700</Text>
          <Text style={styles.containerTopAmountSubText}>Left $300</Text>
        </View>
      </View>
      <View>
        {arrays.map((item, index) => {
          const showSeparator: boolean = arrays.length !== index + 1;

          return (
            <Fragment key={index}>
              <TouchableOpacity
                style={styles.cont}
                onPress={() => navigateToDetails("ID")}
              >
                <View style={styles.contIcon}>
                  <SFSymbol
                    weight="thin"
                    size={17}
                    name="fork.knife"
                    colors={[colors.grayLight]}
                  />
                  <View style={styles.notifIcon}>
                    <SFSymbol
                      weight="medium"
                      size={10}
                      name="alarm.waves.left.and.right"
                      colors={[colors.blue]}
                    />
                  </View>
                </View>
                <View style={styles.contData}>
                  <View style={styles.contDataTexts}>
                    <View style={styles.contTextTop}>
                      <Text style={styles.contTextTopTitle}>Car gas</Text>
                      <Text style={styles.contTextTopSub}>
                        $20 left from{" "}
                        <Text style={styles.contTextTopSubSub}>$100</Text>
                      </Text>
                    </View>
                    <View style={styles.chevronCont}>
                      <SFSymbol
                        weight="regular"
                        size={14}
                        name="chevron.right"
                        colors={[colors.grayLight]}
                      />
                      <Text style={styles.chevronContText}>
                        Due: 2025-12-11
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Progress value={30} size="xs">
                      <ProgressFilledTrack bgColor={colors.purple} />
                    </Progress>
                  </View>
                </View>
              </TouchableOpacity>
              {showSeparator && (
                <View style={styles.containerSeparator}>
                  <FormListSeparator />
                </View>
              )}
            </Fragment>
          );
        })}
      </View>
    </FormListContainer>
  );
};

const styles = StyleSheet.create({
  cont: {
    paddingRight: 10,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  contIcon: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.gray,
    position: "relative",
    marginRight: 3,
  },
  contData: { flex: 1 },
  contDataTexts: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  chevronCont: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 3,
  },
  chevronContText: {
    fontSize: 13,
    color: colors.grayLight,
  },
  contTextTop: {},
  contTextTopTitle: {
    color: colors.white,
    fontSize: 20,
    marginBottom: 2,
    fontWeight: "900",
  },
  contTextTopSub: {
    color: colors.grayLight,
    fontSize: 16,
    fontWeight: "600",
  },
  contTextTopSubSub: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "700",
  },
  notifIcon: {
    position: "absolute",
    top: -6,
    right: -3,
  },
  containerSeparator: { paddingLeft: 50 },
  container: { paddingHorizontal: 0, paddingVertical: 14 },
  containerTop: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  containerTopIcon: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.gray,
  },
  containerTopText: {
    flex: 1,
  },
  containerTopTextLabel: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  containerTopTextPercent: {
    fontSize: 16,
    color: colors.grayLight,
  },
  containerTopAmount: {
    alignItems: "flex-end",
  },
  containerTopAmountText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
    color: colors.blue,
  },
  containerTopAmountSubText: {
    fontSize: 16,
    color: colors.grayLight,
  },
});

export default BillGroupItem;
