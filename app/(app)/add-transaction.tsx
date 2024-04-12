import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ButtonLink from "../../components/common/ButtonLink";
import AutoComplete from "../../components/common/AutoComplete";
import { Button, ButtonText, ScrollView } from "@gluestack-ui/themed";
import { ButtonGroup } from "@gluestack-ui/themed";
import ToggleButton from "../../components/common/ToggleButton";

const AddTransaction = () => {
  const handle = () => {
    console.log("saving");
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerContainer}>
        <ButtonLink style={styles.btnStyle} href="../" title="Cancel" />
        <ButtonLink
          style={styles.btnStyle}
          href=""
          onPress={handle}
          title="Save"
        />
      </View>
      <View>
        <ToggleButton />
        <AutoComplete />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  btnStyle: { fontSize: 19 },
});

export default AddTransaction;
