import { IInputProps } from "@gluestack-ui/input/lib/typescript/types";
import { Input, InputField } from "@gluestack-ui/themed";
import { ReactNode, forwardRef } from "react";
import { StyleSheet, TextInputProps, View } from "react-native";

interface InputFormProps {
  InputProps: TextInputProps & IInputProps;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  InputSlot?: ReactNode | null;
  inputHelper?: string;
}

const InputForm = forwardRef<any, InputFormProps>(
  ({ InputSlot, InputProps, isReadOnly }, ref) => {
    return (
      <View style={styles.flex}>
        <Input w="$full" style={styles.inptStyle} isReadOnly={isReadOnly}>
          <InputField
            ref={ref}
            {...InputProps}
            style={{
              ...(InputProps.style as Object),
              ...styles.textInputStyle,
            }}
            keyboardAppearance="dark"
          />
          {InputSlot}
        </Input>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  formControl: { marginBottom: 15 },
  inptStyle: {
    height: 44,
    borderWidth: 0,
    borderBlockColor: "transparent",
  },
  textInputStyle: {
    paddingLeft: 0,
    paddingRight: 20,
    fontSize: 17,
  },
  flex: { flex: 1 },
});

export default InputForm;
