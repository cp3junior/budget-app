import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  Input,
} from "@gluestack-ui/themed";
import Text from "./Text";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../lib/theme";
import { InputField } from "@gluestack-ui/themed";

interface DialogEditProps {
  title: string;
  show: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onSubmit?: () => Promise<void>;
}

const DialogEdit = ({ title, show, onClose, onSubmit }: DialogEditProps) => {
  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit();
    }
    onClose();
  };
  return (
    <AlertDialog size="sm" isOpen={show} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogBody style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.txtTitle} fontWeight="800">
              {title}
            </Text>
            <Input
              w="$full"
              $focus-borderColor={colors.blue}
              style={styles.inptStyle}
            >
              <InputField
                placeholder="Enter a text"
                keyboardAppearance="dark"
              />
            </Input>
          </View>
          <View style={styles.footerContaier}>
            <TouchableOpacity
              style={{ ...styles.buttonContainer, ...styles.borRight }}
              onPress={onClose}
            >
              <Text style={styles.txtStyle} fontWeight="600">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleSubmit}
            >
              <Text style={styles.txtStyle} fontWeight="600">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  contentContainer: {
    padding: 20,
  },
  footerContaier: {
    flexDirection: "row",
    borderTopColor: colors.gray,
    borderTopWidth: 0.5,
  },
  borRight: {
    borderRightColor: colors.gray,
    borderRightWidth: 0.5,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    flex: 1,
  },
  txtTitle: { textAlign: "center", marginBottom: 20 },
  txtStyle: {
    color: colors.blue,
  },
  inptStyle: {
    height: 40,
  },
});

export default DialogEdit;
