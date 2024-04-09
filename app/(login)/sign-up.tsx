import { StyleSheet, TextInput, View } from "react-native";
import { useRef, useState } from "react";
import Text from "../../components/common/Text";
import IntroHeader from "../../components/IntroHeader";
import { Formik, FormikHelpers } from "formik";
import {
  EyeOffIcon,
  InputIcon,
  InputSlot,
  ScrollView,
} from "@gluestack-ui/themed";
import { colors } from "../../lib/theme";
import { EyeIcon } from "@gluestack-ui/themed";
import ButtonLink from "../../components/common/ButtonLink";
import Button from "../../components/common/Button";
import InputForm from "../../components/common/InputForm";

interface SignUpForm {
  fullName: string;
  email: string;
  password: string;
  rePassword: string;
}

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const emailInput = useRef<TextInput>(null);
  const passwordInput = useRef<TextInput>(null);
  const rePasswordInput = useRef<TextInput>(null);

  const initialFormValues: SignUpForm = {
    fullName: "",
    email: "",
    password: "",
    rePassword: "",
  };

  const changePasswordType = () => {
    setShowPassword((old) => !old);
  };
  const changeRePasswordType = () => {
    setShowRePassword((old) => !old);
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
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text fontWeight="800" style={styles.txtH}>
          Hello there!
        </Text>
        <Text fontWeight="500" style={styles.txtW}>
          Create your account to start
        </Text>
      </View>
      <IntroHeader small />
      <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.formContainer}>
            <InputForm
              isRequired
              isInvalid={false}
              label="Full Name"
              errorText="Full name required."
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
            <InputForm
              ref={emailInput}
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
                onSubmitEditing: handleFocusRePassword,
                type: showPassword ? "text" : "password",
                blurOnSubmit: false,
                returnKeyType: "next",
              }}
              InputSlot={
                <InputSlot pr="$3" onPress={changePasswordType}>
                  <InputIcon
                    as={showPassword ? EyeIcon : EyeOffIcon}
                    color="$darkBlue500"
                  />
                </InputSlot>
              }
            />
            <InputForm
              ref={rePasswordInput}
              isRequired
              isInvalid={false}
              label="Re-type Password"
              errorText="Password required."
              InputProps={{
                placeholder: "Re-type Password",
                value: values.rePassword,
                onChangeText: handleChange("rePassword"),
                onBlur: handleBlur("rePassword"),
                onSubmitEditing: () => handleSubmit(),
                type: showRePassword ? "text" : "password",
                returnKeyType: "send",
              }}
              InputSlot={
                <InputSlot pr="$3" onPress={changeRePasswordType}>
                  <InputIcon
                    as={showRePassword ? EyeIcon : EyeOffIcon}
                    color="$darkBlue500"
                  />
                </InputSlot>
              }
            />
            <View style={styles.containerBtn}>
              <Button title="Sign up" onPress={() => handleSubmit()} />
            </View>
            <View style={styles.containerTxtLink}>
              <ButtonLink
                style={styles.lnkText}
                href="/sign-in"
                title="Login to your account"
              />
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
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

export default SignUp;
