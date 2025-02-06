import { updateProfile } from "@firebase/auth";
import { InputSlot, Spinner } from "@gluestack-ui/themed";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";
import YupPassword from "yup-password";
import ErrorText from "../../components/ErrorText";
import IntroHeader from "../../components/IntroHeader";
import ButtonLink from "../../components/common/ButtonLink";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import FormListSubmitIcon from "../../components/common/FormList/FormListSubmitIcon";
import InputForm from "../../components/common/InputForm";
import { COLLECTION_USER } from "../../lib/constant";
import { signUp } from "../../lib/firebaseAuth";
import { addDocument, fetchDocuments } from "../../lib/firebaseFirestore";
import { getErrorMessage } from "../../lib/helpers";
import { colors } from "../../lib/theme";

YupPassword(Yup);

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().password().required("Required"),
  rePassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
});

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailInput = useRef<TextInput>(null);
  const passwordInput = useRef<TextInput>(null);
  const rePasswordInput = useRef<TextInput>(null);

  const initialFormValues: SignUpForm = {
    firstName: "",
    lastName: "",
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

  const handleSubmit = async ({
    email,
    password,
    firstName,
    lastName,
  }: SignUpForm) => {
    setLoading(true);
    setError("");

    try {
      const credentials = await signUp(email, password);

      const user: UserFirestore = {
        uid: credentials.user.uid,
        email,
        firstName,
        lastName,
        image: "",
        isSharing: false,
        sharedAccounId: email,
        sharingEmails: [],
        createdAt: new Date(),
      };

      await addDocument<UserFirestore>(COLLECTION_USER, user);

      await updateProfile(credentials.user, {
        displayName: `${firstName} ${lastName}`,
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
        <IntroHeader small text="Create your account to start" />
        <Formik
          initialValues={initialFormValues}
          onSubmit={handleSubmit}
          validationSchema={SignupSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <FormListContainer>
                <InputForm
                  isRequired
                  isInvalid={Boolean(errors?.firstName && touched?.firstName)}
                  InputProps={{
                    placeholder: "First name",
                    value: values.firstName,
                    onChangeText: handleChange("firstName"),
                    onBlur: handleBlur("firstName"),
                    onSubmitEditing: handleFocusEmail,
                    type: "text",
                    blurOnSubmit: false,
                    returnKeyType: "next",
                  }}
                />
                <FormListSeparator />
                <InputForm
                  isRequired
                  isInvalid={Boolean(errors?.lastName && touched?.lastName)}
                  InputProps={{
                    placeholder: "Last name",
                    value: values.lastName,
                    onChangeText: handleChange("lastName"),
                    onBlur: handleBlur("lastName"),
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
                  isRequired
                  isInvalid={Boolean(errors?.password && touched?.password)}
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
                  isInvalid={Boolean(errors?.rePassword && touched?.rePassword)}
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
              {Boolean(errors?.password && touched?.password) &&
                errors?.password !== "Required" && (
                  <ErrorText message={errors.password || ""} />
                )}
              {Boolean(errors?.rePassword && touched?.rePassword) &&
                errors?.rePassword !== "Required" &&
                !errors?.password && (
                  <ErrorText message={errors.rePassword || ""} />
                )}
              {error && <ErrorText message={error} />}
            </>
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
