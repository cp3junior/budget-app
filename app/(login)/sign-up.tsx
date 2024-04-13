import { InputSlot, Spinner } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../../components/IntroHeader";
import ButtonLink from "../../components/common/ButtonLink";
import InputForm from "../../components/common/InputForm";
import { colors } from "../../lib/theme";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSubmitIcon from "../../components/common/FormList/FormListSubmitIcon";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";

interface SignUpForm {
  fullName: string;
  email: string;
  password: string;
  rePassword: string;
}

const SignUp = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const emailInput = useRef<TextInput>(null);
  const passwordInput = useRef<TextInput>(null);
  const rePasswordInput = useRef<TextInput>(null);

  const initialFormValues: SignUpForm = {
    fullName: "",
    email: "",
    password: "",
    rePassword: "",
  };

  const handleFocusEmail = () => {
    emailInput.current?.focus();
  };
  const handleFocusPassword = () => {
    passwordInput.current?.focus();
  };
  const handleFocusRePassword = () => {
    rePasswordInput.current?.focus();
  };

  const handleSubmit = (
    values: SignUpForm,
    actions: FormikHelpers<SignUpForm>
  ) => {
    console.log(values, actions);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.navigate("/home");
      console.log("saved");
    }, 500);
  };

  return (
    <View style={styles.flex}>
      <KeyboardAwareScrollView style={styles.flex}>
        <IntroHeader small text="Create your account to start" />
        <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <FormListContainer>
              <InputForm
                isRequired
                isInvalid={false}
                InputProps={{
                  placeholder: "Full name",
                  value: values.fullName,
                  onChangeText: handleChange("fullName"),
                  onBlur: handleBlur("fullName"),
                  onSubmitEditing: handleFocusEmail,
                  type: "text",
                  blurOnSubmit: false,
                  returnKeyType: "next",
                }}
              />
              <FormListSeparator />
              <InputForm
                ref={emailInput}
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
                  onSubmitEditing: handleFocusRePassword,
                  type: "password",
                  blurOnSubmit: false,
                  returnKeyType: "next",
                }}
              />
              <FormListSeparator />
              <InputForm
                ref={rePasswordInput}
                isRequired
                isInvalid={false}
                InputProps={{
                  placeholder: "Re-type Password",
                  value: values.rePassword,
                  onChangeText: handleChange("rePassword"),
                  onBlur: handleBlur("rePassword"),
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
          href="/sign-in"
          title="Login to your account"
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

export default SignUp;
