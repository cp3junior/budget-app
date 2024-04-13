import { Formik, FormikHelpers } from "formik";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../../components/IntroHeader";
import ButtonLink from "../../components/common/ButtonLink";
import InputForm from "../../components/common/InputForm";
import { colors } from "../../lib/theme";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import { InputSlot } from "@gluestack-ui/themed";
import FormListSubmitIcon from "../../components/common/FormList/FormListSubmitIcon";

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword = () => {
  const initialFormValues: ForgotPasswordForm = { email: "" };

  const handleSubmit = (
    values: ForgotPasswordForm,
    actions: FormikHelpers<ForgotPasswordForm>
  ) => {
    console.log(values, actions);
  };

  return (
    <View style={styles.flex}>
      <KeyboardAwareScrollView style={styles.flex}>
        <IntroHeader small text="Reset your password" />
        <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <FormListContainer>
              <InputForm
                isRequired
                isInvalid={false}
                InputProps={{
                  placeholder: "Enter your email here",
                  value: values.email,
                  onChangeText: handleChange("email"),
                  onBlur: handleBlur("email"),
                  onSubmitEditing: () => handleSubmit(),
                  type: "text",
                  keyboardType: "email-address",
                  returnKeyType: "send",
                }}
                InputSlot={
                  <InputSlot
                    pr="$3"
                    disabled={false}
                    onPress={() => handleSubmit()}
                  >
                    <FormListSubmitIcon />
                  </InputSlot>
                }
              />
            </FormListContainer>
          )}
        </Formik>
      </KeyboardAwareScrollView>
      <View style={styles.containerTxtLink}>
        <ButtonLink
          style={styles.lnkText}
          href="/sign-in"
          title="Back to Login"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  containerTxtLink: {
    justifyContent: "center",
    marginBottom: 20,
  },
  lnkText: {
    color: colors.blue,
  },
});

export default ForgotPassword;
