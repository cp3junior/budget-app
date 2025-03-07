import React, { Fragment } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import { colors } from "../../lib/theme";
import FormListContainer from "../common/FormList/FormListContainer";
import Text from "../common/Text";

import { useRouter } from "expo-router";
import FormListSeparator from "../common/FormList/FormListSeparator";
import TransactionItem from "./TransactionItem";

interface TransactionsProps {
  data: TransactionItem[];
  showTitle?: boolean;
  showFooter?: boolean;
}
const Transactions = ({ data, showFooter, showTitle }: TransactionsProps) => {
  const router = useRouter();

  if (data.length === 0) return null;

  const navigateToTransactions = () => {
    router.navigate("/transactions");
  };

  return (
    <View>
      {showTitle && (
        <View>
          <Text style={styles.txtTransac}>Latest transactions</Text>
        </View>
      )}
      <FormListContainer style={styles.containerStyle}>
        {data.map((item, index) => {
          const showSeparator: boolean = data.length !== index + 1;

          return (
            <Fragment key={item.id}>
              <TransactionItem showDate transaction={item} />
              {showSeparator && (
                <View style={styles.containerSeparator}>
                  <FormListSeparator />
                </View>
              )}
            </Fragment>
          );
        })}
        {showFooter && (
          <>
            <View style={styles.containerSeparatorAll}>
              <FormListSeparator />
            </View>
            <TouchableOpacity
              style={styles.containerAll}
              onPress={navigateToTransactions}
            >
              <Text style={styles.txtAll}>See transactions history</Text>
              <View>
                <SFSymbol
                  size={12}
                  name="chevron.right"
                  colors={[colors.grayLight]}
                />
              </View>
            </TouchableOpacity>
          </>
        )}
      </FormListContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: 0,
    flex: 1,
    marginBottom: 10,
  },
  containerSeparator: {
    paddingLeft: 50,
  },
  containerSeparatorAll: {
    marginLeft: -20,
  },
  containerAll: {
    paddingVertical: 11,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txtAll: {
    textTransform: "uppercase",
    color: colors.white,
    fontWeight: "700",
  },
  txtTransac: {
    textTransform: "uppercase",
    fontSize: 16,
    fontWeight: "500",
    color: colors.grayLight,
    paddingLeft: 20,
    marginBottom: 8,
  },
});

export default Transactions;
