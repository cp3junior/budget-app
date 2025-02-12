import { FormControl, Input, InputField } from "@gluestack-ui/themed";
import { forwardRef, useState } from "react";
import { StyleSheet } from "react-native";
import { NumericFormat } from "react-number-format";
import { colors } from "../lib/theme";

interface AmountInputProps {
  isInvalid?: boolean;
  onChange: (text: string) => void;
  value: string;
  index: number;
}

const AmountInput = forwardRef<any, AmountInputProps>(
  ({ isInvalid, index, value, onChange }, ref) => {
    const [internalValue, setInternalValue] = useState(value);

    return (
      <FormControl size="md" isRequired style={styles.container}>
        <Input w="$full" style={styles.inputStyle}>
          <NumericFormat
            value={internalValue}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
            decimalScale={2}
            onValueChange={(values) => {
              onChange(values.value);
            }}
            allowNegative={false}
            renderText={(formattedValue) => (
              <InputField
                ref={ref}
                onChangeText={setInternalValue}
                value={formattedValue}
                placeholder="$0.00"
                style={{
                  ...styles.textInputStyle,
                  color: index === 0 ? colors.red : colors.green,
                }}
                placeholderTextColor={
                  isInvalid ? colors.redVivid : colors.grayLight
                }
                keyboardType="numeric"
                keyboardAppearance="dark"
              />
            )}
          />
        </Input>
      </FormControl>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 40,
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
