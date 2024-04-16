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
import { colors } from "../lib/theme";
import { NumericFormat } from "react-number-format";

interface AmountInputProps {
  isInvalid?: boolean;
  index: number;
}

const AmountInput = forwardRef<any, AmountInputProps>(
  ({ isInvalid, index }, ref) => {
    const [text, setText] = useState("");

    const handleTextChange = (inputText: string) => {
      setText(inputText);
    };

    return (
      <FormControl
        size="md"
        isInvalid={isInvalid}
        isRequired
        style={styles.container}
      >
        <Input w="$full" style={styles.inputStyle}>
          <NumericFormat
            value={text}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
            renderText={(formattedValue) => (
              <InputField
                ref={ref}
                onChangeText={handleTextChange}
                value={formattedValue}
                placeholder="$0.00"
                style={{
                  ...styles.textInputStyle,
                  color: index === 0 ? colors.red : colors.green,
                }}
                keyboardType="numeric"
                keyboardAppearance="dark"
              />
            )}
          />
        </Input>

        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>The amount is required</FormControlErrorText>
        </FormControlError>
      </FormControl>
    );
  }
);

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
    fontFamily: "FjallaOne",
  },
});

export default AmountInput;
