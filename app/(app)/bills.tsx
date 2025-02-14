import { Progress, ProgressFilledTrack } from "@gluestack-ui/themed";
import { Stack, useRouter } from "expo-router";
import { Fragment, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DropDownMenu from "../../components/common/DropDownMenu/DropDownMenu";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import HeaderTitle from "../../components/HeaderTitle";
import withTabBar from "../../hoc/withTabBar";
import {
  generateMonthListDropdown,
  getMonthDropdown,
} from "../../lib/dateHelpers";
import { colors } from "../../lib/theme";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import SFSymbol from "sweet-sfsymbols";
import BillGroupItem from "../../components/bills/BillGroupItem";
const monthsDropDown = generateMonthListDropdown(new Date());
const currentMonthDefault = getMonthDropdown(new Date());

const Bills = () => {
  const router = useRouter();

  const [currentMonth, setCurrentMonth] =
    useState<DropdownItem>(currentMonthDefault);

  const navigateToAddBills = () => {
    router.push("/bills-edit");
  };
  const handleMonthChange = (item: DropdownItem) => {
    setCurrentMonth(item);
  };

  return (
    <SafeContainer hasHeader>
      <Stack.Screen
        options={{
          header: () => (
            <HeaderTitle
              onPressButton={navigateToAddBills}
              hasButton
              title="Expenses"
            />
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.containerDropdown}>
          <DropDownMenu
            label=""
            id="type"
            value={currentMonth}
            onChange={handleMonthChange}
            data={monthsDropDown}
            labelStyle={styles.labelStyle}
          />
        </View>
        <Text style={styles.textTitle}>$1,000.00</Text>
        <Text style={styles.textSub}>This Month’s Budget</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressDetCOntainer}>
            <View>
              <Text style={styles.progressDetTextTop}>Spent</Text>
              <Text
                style={{
                  ...styles.progressDetTextBottom,
                  ...{ color: colors.red },
                }}
              >
                $100
              </Text>
            </View>
            <View>
              <Text
                style={{
                  ...styles.progressDetTextTop,
                  ...{ textAlign: "right" },
                }}
              >
                Left to spend
              </Text>
              <Text
                style={{
                  ...styles.progressDetTextBottom,
                  ...{ textAlign: "right" },
                  ...{ color: colors.green },
                }}
              >
                $10
              </Text>
            </View>
          </View>
          <View>
            <Progress value={50} size="sm">
              <ProgressFilledTrack bgColor={colors.purple} />
            </Progress>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <BillGroupItem />
          <BillGroupItem />
          <BillGroupItem />
        </View>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  textTitle: {
    textAlign: "center",
    fontSize: 54,
    fontWeight: "900",
    color: colors.blue,
  },
  labelStyle: { fontWeight: "900", color: colors.grayLight },
  container: { marginTop: 20 },
  containerDropdown: { alignItems: "center" },
  textSub: { fontSize: 14, color: colors.grayLight, textAlign: "center" },
  progressContainer: {
    marginTop: 40,
    borderWidth: 0.2,
    borderColor: colors.grayLight,
    borderRadius: 10,
    padding: 16,
  },
  progressDetCOntainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  progressDetTextTop: {
    color: colors.grayLight,
    fontSize: 14,
    marginBottom: 2,
  },
  progressDetTextBottom: {
    fontSize: 24,
    fontWeight: "900",
  },
});

const BillsScreen = withTabBar(Bills);

export default BillsScreen;
