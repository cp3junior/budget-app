import { Spinner } from "@gluestack-ui/themed";
import { endOfDay, startOfDay } from "date-fns";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SectionList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SFSymbol from "sweet-sfsymbols";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import Text from "../../components/common/Text";
import TransactionItem from "../../components/transactions/TransactionItem";
import { useAppContext } from "../../hook/useAppContext";
import { useFilterContext } from "../../hook/useFilterContext";
import { COLLECTION_TRANSACTIONS } from "../../lib/constant";
import { convertToDate, groupTransactionByDate } from "../../lib/dateHelpers";
import { fetchDocuments } from "../../lib/firebaseFirestore";
import { colors } from "../../lib/theme";

const TransactionsScreen = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const {
    startDate,
    endDate,
    categoryId,
    transactionTypeId,
    transactionDirectionId,
  } = useFilterContext();

  const [filterNumber, setFilterNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [groupedTransactions, setGroupedTransactions] = useState<
    GroupedTransactions[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let newFilterNumber = 0;
      const filters: WhereClause[] = [
        {
          field: "date",
          operator: ">=",
          value: startOfDay(startDate),
        },
        {
          field: "date",
          operator: "<=",
          value: endOfDay(endDate),
        },
      ];

      if (categoryId !== 0) {
        newFilterNumber++;
        const categoryFilter: WhereClause = {
          field: "categoryId",
          operator: "==",
          value: categoryId,
        };
        filters.push(categoryFilter);
      }
      if (transactionTypeId !== 0) {
        newFilterNumber++;
        const transactionTypeFilter: WhereClause = {
          field: "transactionTypeId",
          operator: "==",
          value: transactionTypeId,
        };
        filters.push(transactionTypeFilter);
      }
      if (transactionDirectionId !== 2) {
        newFilterNumber++;
        const transactionDirectionFilter: WhereClause = {
          field: "transactionDirection",
          operator: "==",
          value: transactionDirectionId,
        };
        filters.push(transactionDirectionFilter);
      }

      const data = await fetchDocuments<TransactionItem>(
        COLLECTION_TRANSACTIONS,
        { whereClauses: filters }
      );

      const transactions = data.sort(
        (a, b) =>
          convertToDate(b.date).getTime() - convertToDate(a.date).getTime()
      );

      const grouped = groupTransactionByDate(transactions);

      setFilterNumber(newFilterNumber);
      setGroupedTransactions(grouped);
      setIsLoading(false);
    };

    fetchData();
  }, [
    startDate,
    endDate,
    categoryId,
    transactionTypeId,
    transactionDirectionId,
  ]);

  if (!user) return null;

  const navigateToFilter = () => {
    router.navigate("/transaction-filter");
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      <Stack.Screen
        options={{
          headerTitle: "Transaction history",
          headerRight: () =>
            isLoading ? (
              <Spinner color={colors.blue} />
            ) : (
              <TouchableOpacity
                onPress={navigateToFilter}
                style={styles.containerIcon}
              >
                <SFSymbol
                  weight="regular"
                  size={22}
                  name="slider.horizontal.3"
                  colors={[colors.blue]}
                />
                {filterNumber > 0 && (
                  <View style={styles.containerNumber}>
                    <Text style={styles.containerNumberText}>
                      {filterNumber}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ),
        }}
      />
      {groupedTransactions.length === 0 && (
        <View>
          <Text style={styles.noTransac}>
            No transactions available. Try adjusting the filter.
          </Text>
        </View>
      )}
      {groupedTransactions.length > 0 && (
        <View style={{ height: 200 }}>
          <Text>Datat</Text>
        </View>
      )}
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
    flex: 1,
  },
  containerIcon: {
    position: "relative",
  },
  containerNumber: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: colors.purple,
    borderRadius: 10,
    right: -10,
    top: -10,
    justifyContent: "center",
    alignItems: "center",
  },
  containerNumberText: {
    fontSize: 14,
    fontWeight: "900",
  },
  filtContText: {
    fontSize: 12,
    color: colors.grayLight,
    textAlign: "center",
    marginVertical: 10,
  },
  noTransac: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginVertical: 10,
    color: colors.grayLight,
  },
});

export default TransactionsScreen;
