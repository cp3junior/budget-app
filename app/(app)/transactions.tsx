import { Stack } from "expo-router";
import { SectionList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import Text from "../../components/common/Text";
import TransactionItem from "../../components/transactions/TransactionItem";
import { useAppContext } from "../../hook/useAppContext";
import { convertToDate, groupTransactionByDate } from "../../lib/dateHelpers";
import { colors } from "../../lib/theme";

const TransactionsScreen = () => {
  const { user, monthlyTransactions } = useAppContext();

  if (!user) return null;

  const transactions = monthlyTransactions.sort(
    (a, b) => convertToDate(b.date).getTime() - convertToDate(a.date).getTime()
  );
  const groupedTransactions = groupTransactionByDate(transactions);

  const DATA = [
    {
      title: "Fruits",
      data: ["Apple", "Banana", "Orange"],
    },
    {
      title: "Fruitsone",
      data: ["Orange"],
    },
    {
      title: "Vegetables",
      data: ["Carrot", "Broccoli", "Spinach"],
    },
    {
      title: "Dairy",
      data: [
        "Milk",
        "Cheese",
        "Yogurt",
        "Cheese",
        "Yogurt",
        "Cheese",
        "Yogurt",
        "Cheese",
        "Yogurt",
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      <Stack.Screen
        options={{
          headerTitle: "Transaction history",
        }}
      />
      <View style={styles.itemCOnt}>
        <SectionList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          sections={groupedTransactions}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <View style={styles.containerSeparator}>
              <FormListSeparator />
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.itemCont}>
              <TransactionItem noPad transaction={item} />
            </View>
          )}
          renderSectionHeader={({ section: { formatedDate } }) => (
            <View style={styles.header}>
              <Text style={styles.headerText}>{formatedDate}</Text>
            </View>
          )}
          stickySectionHeadersEnabled
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  containerSeparator: {
    paddingLeft: 50,
  },
  listContainer: {
    backgroundColor: colors.dark,
  },
  itemCont: {
    paddingLeft: 5,
  },
  header: {
    paddingBottom: 6,
    backgroundColor: colors.darker,
    paddingTop: 6,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.grayLight,
  },
  itemCOnt: {
    marginBottom: 30,
  },
});

export default TransactionsScreen;
