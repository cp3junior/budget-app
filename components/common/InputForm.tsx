import { IInputProps } from "@gluestack-ui/input/lib/typescript/types";
import {
  AlertCircleIcon,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField as InputFieldGUI,
} from "@gluestack-ui/themed";
import { ReactNode, forwardRef } from "react";
import { StyleSheet, TextInputProps, ViewStyle } from "react-native";

interface InputFormProps {
  label: string;
  InputProps: TextInputProps & IInputProps;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorText?: string;
  styleFormContainer?: ViewStyle;
  InputSlot?: ReactNode | null;
  inputHelper?: string;
}

const InputForm = forwardRef<any, InputFormProps>(
  (
    {
      styleFormContainer,
      label,
      InputSlot,
      inputHelper,
      errorText,
      isRequired,
      isInvalid,
      InputProps,
    },
    ref
  ) => {
    return (
      <FormControl
        size="md"
        isInvalid={isInvalid}
        isRequired={isRequired}
        style={{
          ...styles.formControl,
          ...Object.assign({}, styleFormContainer),
        }}
      >
        <FormControlLabel mb="$2">
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputFieldGUI ref={ref} {...InputProps} />
          {InputSlot}
        </Input>
        {inputHelper && (
          <FormControlHelper>
            <FormControlHelperText>{inputHelper}</FormControlHelperText>
          </FormControlHelper>
        )}
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>
            {errorText ?? "An error occured"}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>
    );
  }
);

const styles = StyleSheet.create({
  formControl: { marginBottom: 20 },
});

export default InputForm;
