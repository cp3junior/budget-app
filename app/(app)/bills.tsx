import { Stack } from "expo-router";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import withTabBar from "../../hoc/withTabBar";
import HeaderTitle from "../../components/HeaderTitle";
import { StyleSheet, View } from "react-native";
import DropDownMenu from "../../components/common/DropDownMenu/DropDownMenu";

import { useState } from "react";
import {
  generateMonthListDropdown,
  getMonthDropdown,
} from "../../lib/dateHelpers";
import { colors } from "../../lib/theme";

const monthsDropDown = generateMonthListDropdown(new Date());
const currentMonthDefault = getMonthDropdown(new Date());

const Bills = () => {
  const [currentMonth, setCurrentMonth] =
    useState<DropdownItem>(currentMonthDefault);

  const navigateToAddBills = () => {
    const list = generateMonthListDropdown(new Date());
    console.log(list);
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
        <Text>This Month’s Budget</Text>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  textTitle: { textAlign: "center", fontSize: 54, fontWeight: "900" },
  labelStyle: { fontWeight: "900", color: colors.grayLight },
  container: { marginTop: 20 },
  containerDropdown: { alignItems: "center" },
});

const BillsScreen = withTabBar(Bills);

export default BillsScreen;
