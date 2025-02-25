import { InputSlot, Spinner } from "@gluestack-ui/themed";
import { useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";
import ErrorText from "../../components/ErrorText";
import IntroHeader from "../../components/IntroHeader";
import ButtonLink from "../../components/common/ButtonLink";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import FormListSubmitIcon from "../../components/common/FormList/FormListSubmitIcon";
import InputForm from "../../components/common/InputForm";
import { signIn } from "../../lib/firebaseAuth";
import { getErrorMessage } from "../../lib/helpers";
import { colors } from "../../lib/theme";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResetPasswordMessage, setShowResetPasswordMessage] =
    useState(false);

  const passwordInput = useRef<TextInput>(null);
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params?.email) {
      setShowResetPasswordMessage(true);
      passwordInput.current?.focus();
    } else {
      setShowResetPasswordMessage(false);
    }
  }, [params]);

  const initialFormValues: SignInForm = {
    email: (params?.email as string) || "",
    password: "",
  };

  const handleFocusPassword = () => {
    passwordInput.current?.focus();
  };

  const handleSubmit = async ({ email, password }: SignInForm) => {
    setLoading(true);
    setError("");

    try {
      await signIn(email, password);
    } catch (error) {
      const message = getErrorMessage(error);
      setError(message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.flex}>
      <KeyboardAwareScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <IntroHeader small text="Login to continue" />
        <Formik
          initialValues={initialFormValues}
          onSubmit={handleSubmit}
          validationSchema={SignInSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <FormListContainer
              footer={
                <View style={styles.forgot}>
                  <ButtonLink
                    style={{
                      ...styles.lnkText,
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                    href="/forgot-password"
                    title="Forgot password ?"
                  />
                </View>
              }
            >
              <InputForm
                isInvalid={Boolean(errors?.email && touched?.email)}
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
                isInvalid={Boolean(errors?.password && touched?.password)}
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
        {error && <ErrorText message={error} />}
        {showResetPasswordMessage && (
          <ErrorText
            isMessage
            message="Password reset email sent! Please check your inbox and follow the instructions to reset your password. Once reset, you can log in with your new password."
          />
        )}
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
