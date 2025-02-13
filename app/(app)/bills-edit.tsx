import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Text from "../../components/common/Text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AmountInput from "../../components/AmountInput";
import ModalHeader from "../../components/common/ModalHeader";

const BillsEdit = () => {
  const wishlistId = "";
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");

  const handleSave = () => {
    console.log("DAV");
  };
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ModalHeader
        onPress={handleSave}
        title={wishlistId ? "Save" : "Add"}
        isLoading={isLoading}
      />
      <AmountInput
        // ref={amountInput}
        value={amount}
        onChange={setAmount}
        index={1}
        isInvalid={false}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});

export default BillsEdit;
