import {
  AlertCircleIcon,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { forwardRef, useState } from "react";
import { StyleSheet } from "react-native";
import { formatCurrency } from "../lib/helpers";
import { colors } from "../lib/theme";

interface AmountInputProps {
  isInvalid?: boolean;
}

const AmountInput = forwardRef<any, AmountInputProps>(({ isInvalid }, ref) => {
  const [text, setText] = useState("");

  const handleTextChange = (inputText: string) => {
    const [formattedValue] = formatCurrency(inputText);

    setText(formattedValue);
  };

  return (
    <FormControl
      size="md"
      isInvalid={isInvalid}
      isRequired
      style={styles.container}
    >
      <Input w="$full" style={styles.inputStyle}>
        <InputField
          ref={ref}
          onChangeText={handleTextChange}
          value={text}
          placeholder="$0.00"
          style={styles.textInputStyle}
          keyboardType="numeric"
        />
      </Input>

      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>The amount is required</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  inputStyle: {
    textAlign: "center",
    borderColor: "none",
    borderWidth: 0,
    height: "auto",
  },
  textInputStyle: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    textAlign: "center",
    fontSize: 70,
    color: colors.blue,
    fontFamily: "FjallaOne",
  },
});

export default AmountInput;
