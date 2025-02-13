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

  const arrays = new Array(5).fill(0);

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
        <View>
          <FormListContainer style={{ paddingHorizontal: 0 }}>
            <View
              style={{
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingRight: 10,
                paddingTop: 10,
              }}
            >
              <View>
                <SFSymbol
                  weight="thin"
                  size={22}
                  name="trash.circle"
                  colors={[colors.redVivid]}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text>Transportation</Text>
                <Text>30%</Text>
              </View>
              <View>
                <Text>$700</Text>
              </View>
            </View>
            {arrays.map((item, index) => {
              const showSeparator: boolean = arrays.length !== index + 1;

              return (
                <Fragment key={index}>
                  <TouchableOpacity
                    style={{
                      paddingRight: 10,
                      marginVertical: 10,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <View>
                      <SFSymbol
                        weight="thin"
                        size={24}
                        name="alarm.waves.left.and.right"
                        colors={[colors.grayLight]}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={{ marginBottom: 10 }}>
                          <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text>Car gas</Text>
                            <SFSymbol
                              weight="thin"
                              size={14}
                              name="alarm.waves.left.and.right"
                              colors={[colors.grayLight]}
                            />
                          </View>
                          <Text>Due Date</Text>
                        </View>
                        <View>
                          <Text>
                            <SFSymbol
                              weight="thin"
                              size={24}
                              name="alarm.waves.left.and.right"
                              colors={[colors.grayLight]}
                            />
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
                    <View style={{ paddingLeft: 50 }}>
                      <FormListSeparator />
                    </View>
                  )}
                </Fragment>
              );
            })}
          </FormListContainer>
        </View>
        <Text>Gouped list</Text>
        <Text>Gouped list percent</Text>
        <Text>Gouped list due date on items</Text>
        <Text>Gouped Icon reminder</Text>
        <Text>Pay bill button?</Text>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  textTitle: { textAlign: "center", fontSize: 54, fontWeight: "900" },
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
