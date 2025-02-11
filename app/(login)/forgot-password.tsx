import { InputSlot, Spinner } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";
import ErrorText from "../../components/ErrorText";
import IntroHeader from "../../components/IntroHeader";
import ButtonLink from "../../components/common/ButtonLink";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSubmitIcon from "../../components/common/FormList/FormListSubmitIcon";
import InputForm from "../../components/common/InputForm";
import { resetPassword } from "../../lib/firebaseAuth";
import { getErrorMessage } from "../../lib/helpers";
import { colors } from "../../lib/theme";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const ForgotPassword = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialFormValues: ForgotPasswordForm = { email: "" };

  const handleSubmit = async ({ email }: ForgotPasswordForm) => {
    setLoading(true);
    setError("");

    try {
      await resetPassword(email);
      router.push({
        pathname: "/sign-in",
        params: { email },
      });
    } catch (error) {
      const message = getErrorMessage(error);
      setError(message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.flex}>
      <KeyboardAwareScrollView style={styles.flex}>
        <IntroHeader small text="Reset your password" />
        <Formik
          initialValues={initialFormValues}
          onSubmit={handleSubmit}
          validationSchema={ForgotPasswordSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <FormListContainer>
              <InputForm
                isInvalid={Boolean(errors?.email && touched?.email)}
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
