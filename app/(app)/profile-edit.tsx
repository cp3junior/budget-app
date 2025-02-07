import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Text from "../../components/common/Text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ModalHeader from "../../components/common/ModalHeader";
import { useRef, useState } from "react";
import { Image } from "@gluestack-ui/themed";
import SFSymbol from "sweet-sfsymbols";
import { colors } from "../../lib/theme";
import { Formik, FormikHelpers } from "formik";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import InputForm from "../../components/common/InputForm";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";

const ProfileEditScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const emailInput = useRef<TextInput>(null);

  const initialFormValues: ProfileForm = {
    firstName: "",
    lastName: "",
    email: "test@email.com",
  };

  const handleSave = () => {
    console.log("Saving");
  };

  const handleSubmit = (
    values: ProfileForm,
    actions: FormikHelpers<ProfileForm>
  ) => {
    setIsLoading(true);
    setTimeout(() => {
      handleSave();
      setIsLoading(false);
    }, 500);
  };

  const handleFocusEmail = () => {
    emailInput.current?.focus();
  };
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ModalHeader onPress={handleSave} title="Save" isLoading={isLoading} />
      <View>
        <View>
          <TouchableOpacity
            // onPress={navigateToProfileEditScreen}
            style={styles.profileContainerStyle}
          >
            <View style={styles.userImageContainer}>
              <Image
                source={require("../../assets/images/user.png")}
                alt="user profile"
                style={styles.userImage}
              />
            </View>
            <View style={styles.ediTextCOnt}>
              <SFSymbol size={13} name="pencil" colors={[colors.white]} />
              <Text style={styles.ediText}>Edit</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
              {({ handleChange, handleBlur, values }) => (
                <FormListContainer style={styles.containerForm}>
                  <InputForm
                    isRequired
                    isInvalid={false}
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
                    isInvalid={false}
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
                    isReadOnly
                    isInvalid={false}
                    InputProps={{
                      placeholder: "Email",
                      value: values.email,
                      onChangeText: handleChange("email"),
                      onBlur: handleBlur("email"),
                      type: "text",
                      blurOnSubmit: false,
                      keyboardType: "email-address",
                      returnKeyType: "next",
                    }}
                  />
                </FormListContainer>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  profileContainerStyle: {
    alignItems: "center",
    flex: 1,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  userImageContainer: {
    padding: 4,
    borderWidth: 3,
    borderColor: colors.purple,
    borderRadius: 200,
  },
  containerForm: {
    padding: 0,
    flex: 1,
    marginTop: 30,
  },
  ediTextCOnt: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ediText: {
    marginLeft: 5,
  },
});

export default ProfileEditScreen;
