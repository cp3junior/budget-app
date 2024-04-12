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
  Textarea,
  TextareaInput,
} from "@gluestack-ui/themed";
import { forwardRef } from "react";
import { StyleSheet, TextInputProps, ViewStyle } from "react-native";
import { colors } from "../../lib/theme";

interface TextAreaFormProps {
  label: string;
  InputProps: TextInputProps & IInputProps;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorText?: string;
  styleFormContainer?: ViewStyle;
  inputHelper?: string;
}

const TextAreaForm = forwardRef<any, TextAreaFormProps>(
  (
    {
      styleFormContainer,
      label,
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
        <Textarea size="md" w="$full" $focus-borderColor={colors.purple}>
          <TextareaInput ref={ref} {...InputProps} />
        </Textarea>
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

export default TextAreaForm;
