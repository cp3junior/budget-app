import { IInputProps } from "@gluestack-ui/input/lib/types";
import { Input, InputField } from "@gluestack-ui/themed";
import { ReactNode, forwardRef } from "react";
import { StyleSheet, TextInputProps, View } from "react-native";
import { colors } from "../../lib/theme";

interface InputFormProps {
  InputProps: TextInputProps & IInputProps;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  InputSlot?: ReactNode | null;
}

const InputForm = forwardRef<any, InputFormProps>(
  ({ InputSlot, InputProps, isReadOnly, isInvalid }, ref) => {
    return (
      <View style={styles.flex}>
        <Input w="$full" style={styles.inptStyle} isReadOnly={isReadOnly}>
          <InputField
            ref={ref}
            placeholderTextColor={
              isInvalid ? colors.redVivid : colors.grayLight
            }
            autoCapitalize="none"
            {...InputProps}
            style={{
              ...styles.textInputStyle,
              ...(InputProps?.style as Object),
              ...(isInvalid ? { color: colors.redVivid } : {}),
              ...(isReadOnly ? { color: colors.grayLight } : {}),
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
