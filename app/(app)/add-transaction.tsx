import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import ButtonLink from "../../components/common/ButtonLink";
import AutoComplete from "../../components/common/AutoComplete";
import { Spinner } from "@gluestack-ui/themed";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ToggleButton from "../../components/common/ToggleButton";
import InputForm from "../../components/common/InputForm";
import TextAreaForm from "../../components/common/TextAreaForm";
import { colors } from "../../lib/theme";
import AmountInput from "../../components/AmountInput";

const types = [
  { label: "Credit", value: "credit" },
  { label: "Debit", value: "debit" },
];

const directions = [
  { label: "Outgoing", value: "outgoing", activeBg: colors.red },
  { label: "Incoming", value: "incoming", activeBg: colors.green },
];

const AddTransactionScreen = () => {
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log("saved");
    }, 2000);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerContainer}>
        <ButtonLink style={styles.btnStyle} href="../" title="Cancel" />
        {loading ? (
          <Spinner color={colors.blue} />
        ) : (
          <ButtonLink
            style={styles.btnStyle}
            href=""
            onPress={handle}
            title="Save"
          />
        )}
      </View>
      <View>
        <ToggleButton items={directions} />
        <AmountInput />
        <AutoComplete zIndex={2} label="Category" />
        <AutoComplete zIndex={1} label="Localisation" />
        <InputForm label="Date" InputProps={{}} />
        <TextAreaForm label="Description" InputProps={{}} />
        <ToggleButton items={types} />
      </View>
    </KeyboardAwareScrollView>
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
    marginBottom: 15,
  },
  btnStyle: { fontSize: 19 },
});

export default AddTransactionScreen;
