import { StyleSheet, View } from "react-native";
import ButtonLink from "./ButtonLink";
import { Spinner } from "@gluestack-ui/themed";
import { colors } from "../../lib/theme";

interface ModalHeaderProps {
  onPress: () => void;
  isLoading: boolean;
  title: string;
}

const ModalHeader = ({ onPress, isLoading, title }: ModalHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <ButtonLink
        style={{
          ...styles.btnStyle,
        }}
        href="../"
        title="Cancel"
      />
      {isLoading ? (
        <Spinner color={colors.blue} />
      ) : (
        <ButtonLink
          style={{
            ...styles.btnStyle,
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
  btnStyle: { fontSize: 18, color: colors.white },
});

export default ModalHeader;
