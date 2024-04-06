import {
  AlertCircleIcon,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@gluestack-ui/themed";
import { Input } from "@gluestack-ui/themed";
import { FormControlHelper } from "@gluestack-ui/themed";
import { FormControlHelperText } from "@gluestack-ui/themed";
import { InputField as InputFieldGUI } from "@gluestack-ui/themed";
import { FormControl } from "@gluestack-ui/themed";
import { ReactNode, forwardRef, useRef } from "react";
import {
  ViewStyle,
  StyleSheet,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
  TextInput,
} from "react-native";

interface InputFormProps {
  label: string;
  type: "text" | "password";
  placeholder?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  blurOnSubmit?: boolean;
  errorText?: string;
  styleFormContainer?: ViewStyle;
  InputSlot?: ReactNode;
  inputHelper?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: any) => void;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
}

const InputForm = forwardRef<TextInput, InputFormProps>(
  (
    {
      styleFormContainer,
      placeholder,
      type,
      label,
      InputSlot,
      inputHelper,
      errorText,
      isRequired,
      isInvalid,
      value,
      onBlur,
      onChangeText,
      keyboardType,
      returnKeyType,
      onSubmitEditing,
      blurOnSubmit,
    },
    ref
  ) => {
    const rrr = useRef();
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
        <FormControlLabel mb="$1">
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputFieldGUI
            ref={ref}
            onChangeText={onChangeText}
            type={type}
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            returnKeyLabel={returnKeyType}
            blurOnSubmit={blurOnSubmit}
            onSubmitEditing={onSubmitEditing}
          />
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
