import {
  EyeIcon,
  EyeOffIcon,
  InputIcon,
  InputSlot,
} from "@gluestack-ui/themed";
import { router } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../../components/IntroHeader";
import Button from "../../components/common/Button";
import ButtonLink from "../../components/common/ButtonLink";
import InputForm from "../../components/common/InputForm";
import Text from "../../components/common/Text";
import { colors } from "../../lib/theme";

interface SignInForm {
  email: string;
  password: string;
}

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const passwordInput = useRef<TextInput>(null);

  const initialFormValues: SignInForm = { email: "", password: "" };

  const changePasswordType = () => {
    setShowPassword((old) => !old);
  };

  const handleFocusPassword = () => {
    passwordInput.current?.focus();
  };

  const handleSubmit = (
    values: SignInForm,
    actions: FormikHelpers<SignInForm>
  ) => {
    console.log(values, actions);
    router.navigate("/home");
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text fontWeight="800" style={styles.txtH}>
          Welcome Back
        </Text>
        <Text fontWeight="500" style={styles.txtW}>
          Login to continue.
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
                onSubmitEditing: handleFocusPassword,
                type: "text",
                blurOnSubmit: false,
                keyboardType: "email-address",
                returnKeyType: "next",
              }}
            />
            <InputForm
              ref={passwordInput}
              isRequired
              isInvalid={false}
              label="Password"
              errorText="Password required."
              InputProps={{
                placeholder: "Password",
                value: values.password,
                onChangeText: handleChange("password"),
                onBlur: handleBlur("password"),
                onSubmitEditing: () => handleSubmit(),
                type: showPassword ? "text" : "password",
                returnKeyType: "send",
              }}
              InputSlot={
                <InputSlot pr="$3" onPress={changePasswordType}>
                  <InputIcon
                    as={showPassword ? EyeIcon : EyeOffIcon}
                    color={colors.purple}
                  />
                </InputSlot>
              }
            />
            <View>
              <ButtonLink
                style={styles.btnLink}
                href="/forgot-password"
                title="Forgot Password?"
              />
            </View>
            <View style={styles.containerBtn}>
              <Button title="Login" onPress={() => handleSubmit()} />
            </View>
            <View style={styles.containerTxtLink}>
              <ButtonLink
                style={styles.lnkText}
                href="/sign-up"
                title="Create Account"
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
  txtW: { fontSize: 27 },
  formContainer: { paddingHorizontal: 20, marginTop: 60 },
  formControl: { marginBottom: 20 },
  containerBtn: { marginTop: 40 },
  btnLink: { textAlign: "left", fontSize: 14 },
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

export default SignIn;
