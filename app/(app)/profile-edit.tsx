import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import { Formik, FormikProps } from "formik";
import { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SFSymbol from "sweet-sfsymbols";
import * as Yup from "yup";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import InputForm from "../../components/common/InputForm";
import ModalHeader from "../../components/common/ModalHeader";
import ProfileImage from "../../components/common/ProfileImage";
import Text from "../../components/common/Text";
import { useAppContext } from "../../hook/useAppContext";
import { COLLECTION_USER } from "../../lib/constant";
import { updateDocument } from "../../lib/firebaseFirestore";
import { getFileExtension } from "../../lib/helpers";
import { colors } from "../../lib/theme";

const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
});

const ProfileEditScreen = () => {
  const { user } = useAppContext();
  const navigation = useNavigation();
  const lastNameInput = useRef<TextInput>(null);
  const formikRef = useRef<FormikProps<ProfileForm> | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const initialFormValues: ProfileForm = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  const handleSave = () => {
    if (formikRef.current) {
      formikRef.current?.handleSubmit();
    }
  };

  const handleSubmit = async ({ firstName, lastName }: ProfileForm) => {
    setIsLoading(true);
    await updateDocument(COLLECTION_USER, user.id, { lastName, firstName });
    navigation.goBack();
  };

  const handleFocusLastName = () => {
    lastNameInput.current?.focus();
  };

  const handleImageChange = async () => {
    try {
      setIsLoading(true);
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "You need to grant gallery access.");
        setIsLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0,
        base64: true,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        const croppedImage = await ImageManipulator.manipulateAsync(
          file.uri,
          [{ resize: { width: 150, height: 150 } }],
          {
            compress: 0.5,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        const extension = getFileExtension(croppedImage.uri);
        let base64Image = croppedImage.base64 as string;

        if (extension && base64Image) {
          base64Image = `data:image/${extension};base64,${base64Image}`;
          await updateDocument(COLLECTION_USER, user.id, {
            image: base64Image,
          });
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
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
            style={styles.profileContainerStyle}
            onPress={handleImageChange}
          >
            <View style={styles.userImageContainer}>
              <ProfileImage style={styles.userImage} />
            </View>
            <View style={styles.ediTextCOnt}>
              <SFSymbol size={13} name="pencil" colors={[colors.white]} />
              <Text style={styles.ediText}>Edit</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Formik
              innerRef={formikRef}
              initialValues={initialFormValues}
              onSubmit={handleSubmit}
              validationSchema={ProfileSchema}
            >
              {({
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
                handleSubmit,
              }) => (
                <FormListContainer style={styles.containerForm}>
                  <InputForm
                    isInvalid={Boolean(errors?.firstName && touched?.firstName)}
                    InputProps={{
                      placeholder: "First name",
                      value: values.firstName,
                      onChangeText: handleChange("firstName"),
                      onBlur: handleBlur("firstName"),
                      onSubmitEditing: handleFocusLastName,
                      type: "text",
                      blurOnSubmit: false,
                      returnKeyType: "next",
                    }}
                  />
                  <FormListSeparator />
                  <InputForm
                    ref={lastNameInput}
                    isInvalid={Boolean(errors?.lastName && touched?.lastName)}
                    InputProps={{
                      placeholder: "Last name",
                      value: values.lastName,
                      onChangeText: handleChange("lastName"),
                      onBlur: handleBlur("lastName"),
                      onSubmitEditing: () => handleSubmit(),
                      type: "text",
                      returnKeyType: "send",
                    }}
                  />
                  <FormListSeparator />
                  <InputForm
                    isReadOnly
                    InputProps={{
                      placeholder: "Email",
                      value: values.email,
                      onChangeText: handleChange("email"),
                      onBlur: handleBlur("email"),
                      type: "text",
                      blurOnSubmit: false,
                      keyboardType: "email-address",
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
