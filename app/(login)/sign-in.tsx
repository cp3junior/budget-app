import { InputSlot, Spinner } from "@gluestack-ui/themed";
import { Formik, FormikHelpers } from "formik";
import { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../../components/IntroHeader";
import ButtonLink from "../../components/common/ButtonLink";
import InputForm from "../../components/common/InputForm";
import { colors } from "../../lib/theme";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import FormListSubmitIcon from "../../components/common/FormList/FormListSubmitIcon";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import { router } from "expo-router";

interface SignInForm {
  email: string;
  password: string;
}

const SignIn = () => {
  const [loading, setLoading] = useState(false);

  const passwordInput = useRef<TextInput>(null);

  const initialFormValues: SignInForm = { email: "", password: "" };

  const handleFocusPassword = () => {
    passwordInput.current?.focus();
  };

  const handleSubmit = (
    values: SignInForm,
    actions: FormikHelpers<SignInForm>
  ) => {
    console.log(values, actions);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.navigate("/home");
      console.log("loged in");
    }, 500);
  };

  return (
    <View style={styles.flex}>
      <KeyboardAwareScrollView style={styles.flex}>
        <IntroHeader small text="Login to continue" />
        <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <FormListContainer
              footer={
                <View style={styles.forgot}>
                  <ButtonLink
                    fontWeight="500"
                    style={{ ...styles.lnkText, fontSize: 16 }}
                    href="/forgot-password"
                    title="Forgot password ?"
                  />
                </View>
              }
            >
              <InputForm
                isRequired
                isInvalid={false}
                InputProps={{
                  placeholder: "Email",
                  value: values.email,
                  onChangeText: handleChange("email"),
                  onBlur: handleBlur("email"),
                  onSubmitEditing: handleFocusPassword,
                  type: "text",
                  blurOnSubmit: false,
                  keyboardType: "email-address",
                  returnKeyType: "next",
                }}
              />
              <FormListSeparator />
              <InputForm
                ref={passwordInput}
                isRequired
                isInvalid={false}
                InputProps={{
                  placeholder: "Password",
                  value: values.password,
                  onChangeText: handleChange("password"),
                  onBlur: handleBlur("password"),
                  onSubmitEditing: () => handleSubmit(),
                  type: "password",
                  returnKeyType: "send",
                }}
                InputSlot={
                  <InputSlot
                    pr="$3"
                    disabled={loading}
                    onPress={() => handleSubmit()}
                  >
                    {loading ? (
                      <Spinner color={colors.blue} />
                    ) : (
                      <FormListSubmitIcon />
                    )}
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
          href="/sign-up"
          title="Create an account"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  forgot: {
    alignItems: "flex-end",
    marginTop: 10,
    marginRight: 3,
  },
  containerTxtLink: {
    justifyContent: "center",
    marginBottom: 20,
  },
  lnkText: {
    color: colors.blue,
  },
});

export default SignIn;
