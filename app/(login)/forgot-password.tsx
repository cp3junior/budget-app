import { Formik, FormikHelpers } from "formik";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../../components/IntroHeader";
import Button from "../../components/common/Button";
import ButtonLink from "../../components/common/ButtonLink";
import InputForm from "../../components/common/InputForm";
import Text from "../../components/common/Text";
import { colors } from "../../lib/theme";

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
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text fontWeight="800" style={styles.txtH}>
          Forgot Password
        </Text>
        <Text fontWeight="500" style={styles.txtW}>
          Enter your email to reset your password
        </Text>
      </View>
      <IntroHeader small />
      <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.formContainer}>
            <InputForm
              isRequired
              isInvalid={false}
              label="Email"
              errorText="Email required."
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
            />
            <View style={styles.containerBtn}>
              <Button title="Reset Password" onPress={() => handleSubmit()} />
            </View>
            <View style={styles.containerTxtLink}>
              <ButtonLink
                style={styles.lnkText}
                href="/sign-in"
                title="Back to login"
              />
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 60,
  },
  txtH: { fontSize: 45, color: colors.blue },
  txtW: { fontSize: 23 },
  formContainer: { paddingHorizontal: 20, marginTop: 60 },
  containerBtn: { marginTop: 40 },
  containerTxtLink: {
    marginTop: 30,
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 70,
  },
  lnkText: {
    color: colors.blue,
  },
});

export default ForgotPassword;
