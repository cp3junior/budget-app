import { StyleSheet, View } from "react-native";
import FormListButtonLink from "../../components/common/FormList/FormListButtonLink";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListItemDetails from "../../components/common/FormList/FormListItemDetails";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import { colors } from "../../lib/theme";

const AboutScreen = () => {
  return (
    <SafeContainer
      hasHeader
      footerView={
        <View>
          <Text style={styles.reserved}>{"©"}2024 All rights reserved.</Text>
        </View>
      }
    >
      <FormListContainer style={styles.containerStyle}>
        <FormListItemDetails label="App name" value="Dollar Dazzle" />
        <FormListSeparator />
        <FormListItemDetails label="Version" value="1.0.0" />
      </FormListContainer>
      <Text style={styles.devStyle}>Developer information</Text>
      <FormListContainer style={styles.containerStyle}>
        <FormListItemDetails label="Name" value="RAILALA Andrew" />
        <FormListSeparator />
        <FormListItemDetails label="Email" value="r3andrew@gmail.com" />
        <FormListSeparator />
        <FormListButtonLink
          label="Website"
          href="https://www.railala.com"
          hasIcon={false}
          value="www.railala.com"
          hasExternal
        />
        <FormListSeparator />
        <FormListButtonLink
          label="Github"
          href="https://github.com/cp3junior"
          hasIcon={false}
          value="@cp3junior"
          hasExternal
        />
      </FormListContainer>
      <Text style={styles.aboutTxt}>
        DollarDazzle is a simple and easy budget management app to keep track of
        your monthly expenses and income. With this app, you can set your
        financial goals, and make informed decisions about your money. It's time
        to get the control back.
      </Text>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  aboutTxt: {
    color: colors.grayLight,
    lineHeight: 20,
    fontSize: 16,
    paddingHorizontal: 20,
    // textAlign: "center",
  },
  containerStyle: {
    padding: 0,
    marginBottom: 30,
  },
  devStyle: {
    textTransform: "uppercase",
    fontSize: 17,
    fontWeight: "500",
    color: colors.grayLight,
    paddingLeft: 20,
    marginBottom: 8,
  },
  reserved: {
    textAlign: "center",
    fontSize: 15,
    color: colors.gray,
    marginBottom: 30,
  },
});

export default AboutScreen;
