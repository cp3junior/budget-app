import { Alert, StyleSheet, View } from "react-native";
import React from "react";
import { colors } from "../../lib/theme";
import Text from "../common/Text";
import { useAppContext } from "../../hook/useAppContext";
import SafeContainer from "../common/SafeContainer";
import FormListContainer from "../common/FormList/FormListContainer";
import FormListButtonLink from "../common/FormList/FormListButtonLink";
import { COLLECTION_REQUESTS, COLLECTION_USER } from "../../lib/constant";
import { fetchDocuments, updateDocument } from "../../lib/firebaseFirestore";

const SharedAccount = () => {
  const { user } = useAppContext();

  if (!user) return null;

  const showPrompt = () => {
    Alert.alert(
      "Revoke Access",
      "Are you sure you want to cancel this access?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Revoke",
          onPress: () => handleRevoke(),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const handleRevoke = async () => {
    const status: StatusRequest = "cancelled";

    const requests = await fetchDocuments<ShareRequest>(COLLECTION_REQUESTS, {
      whereClauses: [
        { field: "sender", value: user.sharedAccounId, operator: "==" },
        { field: "receiver", value: user.email, operator: "==" },
        { field: "status", value: "accepted", operator: "==" },
      ],
    });

    if (requests.length > 0) {
      const request = requests[0];

      await updateDocument(COLLECTION_USER, user.id, {
        sharedAccounId: user.email,
        sharedAccounName: "",
      });
      await updateDocument(COLLECTION_REQUESTS, request.id, {
        status,
      });
    }
  };

  return (
    <SafeContainer
      hasHeader
      footerView={
        <View style={styles.footerCOntainer}>
          <FormListContainer style={styles.containerStyle}>
            <FormListButtonLink
              label="Revoke access"
              hasIcon={false}
              color={colors.redVivid}
              onPress={showPrompt}
              textStyle={styles.textStyle}
            />
          </FormListContainer>
        </View>
      }
    >
      <Text style={styles.aboutTxt}>
        You cannot share your account because{" "}
        {
          <Text style={styles.aboutTxtEmpg}>
            {user.sharedAccounName} ({user.sharedAccounId})
          </Text>
        }{" "}
        has already shared their account with you. You can revoke this access to
        build your own account and be able to share with others.
      </Text>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  aboutTxt: {
    color: colors.grayLight,
    lineHeight: 20,
    fontSize: 16,
  },
  aboutTxtEmpg: {
    color: colors.white,
    lineHeight: 20,
    fontSize: 16,
    fontWeight: "700",
  },
  containerStyle: {
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  footerCOntainer: {
    height: 110,
  },
  textStyle: {
    textAlign: "center",
  },
});

export default SharedAccount;
