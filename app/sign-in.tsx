import { StyleSheet, TextInput, View } from "react-native";
import React, { useRef, useState } from "react";
import BaseLayout from "../layout/BaseLayout";
import Text from "../components/common/Text";
import IntroHeader from "../components/IntroHeader";
import { Formik, FormikHelpers } from "formik";
import {
  EyeOffIcon,
  InputIcon,
  InputSlot,
  ScrollView,
} from "@gluestack-ui/themed";
import { colors } from "../lib/theme";
import { EyeIcon } from "@gluestack-ui/themed";
import ButtonLink from "../components/common/ButtonLink";
import Button from "../components/common/Button";
import InputForm from "../components/common/InputForm";

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

  const handleSubmit = (
    values: SignInForm,
    actions: FormikHelpers<SignInForm>
  ) => {
    console.log(values, actions);
  };

  const handleFocusPassword = () => {
    passwordInput.current?.focus();
  };

  return (
    <BaseLayout>
      <ScrollView>
        <IntroHeader small />
        <View style={styles.container}>
          <Text fontWeight="800" style={styles.txtH}>
            Hello!
          </Text>
          <Text fontWeight="500" style={styles.txtW}>
            Welcome Back.
          </Text>
        </View>
        <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View style={styles.formContainer}>
              <InputForm
                isRequired
                isInvalid={false}
                label="Email"
                placeholder="Enter your email here"
                type="text"
                errorText="Email required."
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={handleFocusPassword}
                blurOnSubmit={false}
              />
              <InputForm
                ref={passwordInput}
                isRequired
                isInvalid={false}
                label="Password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                errorText="Password required."
                InputSlot={
                  <InputSlot pr="$3" onPress={changePasswordType}>
                    <InputIcon
                      as={showPassword ? EyeIcon : EyeOffIcon}
                      color="$darkBlue500"
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
            </View>
          )}
        </Formik>
      </ScrollView>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  txtH: { fontSize: 40, color: colors.blue },
  txtW: { fontSize: 35 },
  formContainer: { paddingHorizontal: 20, marginTop: 20 },
  formControl: { marginBottom: 20 },
  containerBtn: { marginVertical: 40 },
  btnLink: { textAlign: "left", fontSize: 14 },
});

export default SignIn;
