import { StyleSheet, View } from "react-native";
import ButtonLink from "./ButtonLink";
import { Spinner } from "@gluestack-ui/themed";
import { colors } from "../../lib/theme";

interface ModalHeaderProps {
  onPress: () => void;
  isLoading: boolean;
  title: string;
  isSettingPage?: boolean;
}

const ModalHeader = ({
  onPress,
  isLoading,
  title,
  isSettingPage,
}: ModalHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <ButtonLink
        style={{
          ...styles.btnStyle,
          ...{ color: isSettingPage ? colors.purple : colors.blue },
        }}
        href="../"
        title="Cancel"
      />
      {isLoading ? (
        <Spinner color={isSettingPage ? colors.purple : colors.blue} />
      ) : (
        <ButtonLink
          style={{
            ...styles.btnStyle,
            ...{ color: isSettingPage ? colors.purple : colors.blue },
          }}
          href=""
          onPress={onPress}
          title={title}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  btnStyle: { fontSize: 18, color: "red" },
});

export default ModalHeader;
