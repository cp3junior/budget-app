import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { colors } from "../../lib/theme";
import SafeContainer from "../../components/common/SafeContainer";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListButtonLink from "../../components/common/FormList/FormListButtonLink";
import { Stack, useRouter } from "expo-router";
import SFSymbol from "sweet-sfsymbols";
import Text from "../../components/common/Text";
import { Progress, ProgressFilledTrack, Spinner } from "@gluestack-ui/themed";
import ProfileImage from "../../components/common/ProfileImage";

const ExpenseDetails = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const navigateToAddTransaction = () => {
    router.push({
      pathname: "/add-transaction",
      params: { expenseId: "" },
    });
  };

  const handleEditExpense = () => {
    router.push({
      pathname: "/bills-edit",
      params: { expenseId: "ds" },
    });
  };

  return (
    <SafeContainer
      hasHeader
      footerView={
        <View style={styles.containerBtns}>
          <View style={styles.footerCOntainer}>
            <FormListContainer style={styles.containerStyle}>
              <FormListButtonLink
                label="Edit"
                hasIcon={false}
                color={colors.blue}
                textStyle={{ ...styles.textStyle, ...{ fontWeight: "500" } }}
                onPress={handleEditExpense}
              />
            </FormListContainer>
          </View>
          <View style={[styles.footerCOntainer, { flex: 2 }]}>
            <FormListContainer style={styles.containerStyle}>
              <FormListButtonLink
                label="Make a payment"
                hasIcon={false}
                color={colors.green}
                textStyle={styles.textStyle}
                onPress={navigateToAddTransaction}
              />
            </FormListContainer>
          </View>
        </View>
      }
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.containerIcon}>
              <SFSymbol
                weight="regular"
                size={13}
                name={"questionmark"}
                colors={[colors.grayLight]}
              />
            </View>
          ),
        }}
      />
      <View style={styles.contentScroll}>
        <Text style={styles.nameText}>"GASS"</Text>

        <View style={styles.progressContainer}>
          <Text style={styles.progressAmountText}>$100</Text>
          <View style={styles.progressBar}>
            <Progress value={75} size="sm">
              <ProgressFilledTrack bgColor={colors.purple} />
            </Progress>
          </View>
          <View style={styles.progressDetCOntainer}>
            <View>
              <Text style={styles.progressDetTextTop}>Paid to date</Text>
              <Text style={styles.progressDetTextBottom}>$122</Text>
            </View>
            <View>
              <Text
                style={{
                  ...styles.progressDetTextTop,
                  ...{ textAlign: "right" },
                }}
              >
                Remaining
              </Text>
              <Text
                style={{
                  ...styles.progressDetTextBottom,
                  ...{ textAlign: "right" },
                }}
              >
                $100
              </Text>
            </View>
          </View>
        </View>
        {isLoading ? (
          <View style={styles.loadCOntainer}>
            <Spinner color={colors.purple} />
          </View>
        ) : (
          <View style={styles.timelineContainerMain}>
            {[].map((transaction, index) => {
              const isLast = index === [].length - 1;
              return (
                <View key={transaction.id} style={styles.timelineContainer}>
                  <View style={styles.timeline}>
                    <View style={styles.circle} />
                    {!isLast && <View style={styles.line} />}
                  </View>
                  <View style={styles.contentTimeline}>
                    <View>
                      <Text style={styles.title}>Paid: 100</Text>
                      <View style={styles.containerImg}>
                        <View style={styles.userImageContainer}>
                          <ProfileImage
                            style={styles.userImage}
                            externalUser={transaction.user}
                          />
                        </View>
                        <Text style={styles.type}>
                          {transaction?.displayName || ""}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.priceText}>cuuu</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  loadCOntainer: { marginTop: 40 },
  nameText: {
    fontSize: 23,
    marginBottom: 5,
    fontWeight: "900",
    textAlign: "center",
  },
  desctText: { color: colors.grayLight, marginBottom: 20 },
  progressContainer: {
    marginTop: 10,
    borderWidth: 0.2,
    borderColor: colors.grayLight,
    borderRadius: 10,
    padding: 16,
  },
  progressAmountText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "900",
  },
  progressBar: { marginBottom: 10 },
  progressDetCOntainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressDetTextTop: {
    color: colors.grayLight,
    fontSize: 14,
    marginBottom: 2,
  },
  progressDetTextBottom: {
    fontSize: 18,
    fontWeight: "600",
  },
  footerCOntainer: {
    height: 110,
    flex: 1,
  },
  containerBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },

  containerStyle: {
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  textStyle: { textAlign: "center", fontWeight: "900" },
  containerIcon: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: 10,
  },
  ontentScroll: {
    marginBottom: 60,
  },
  timelineContainerMain: { marginTop: 40 },
  timelineContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timeline: {
    alignItems: "center",
    width: 30,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.purple,
  },
  line: {
    width: 1,
    backgroundColor: colors.purple,
    flex: 1,
  },
  contentTimeline: {
    flex: 1,
    paddingLeft: 5,
    paddingBottom: 20,
    marginTop: -5,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  type: {
    fontSize: 16,
    color: colors.grayLight,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  priceText: {
    fontSize: 20,
    fontWeight: "900",
  },
  userImage: {
    width: 24,
    height: 24,
    borderRadius: 20,
  },
  userImageContainer: {
    padding: 2,
    borderWidth: 0.8,
    borderColor: colors.purple,
    borderRadius: 200,
  },
  containerImg: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    marginTop: 5,
  },
});

export default ExpenseDetails;
