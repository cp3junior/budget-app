import { useNavigation } from "expo-router";
import { Unsubscribe } from "firebase/firestore";
import React, { Fragment, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import { useAppContext } from "../../hook/useAppContext";
import { COLLECTION_REQUESTS, COLLECTION_USER } from "../../lib/constant";
import { formatDate } from "../../lib/dateHelpers";
import {
  addDocument,
  fetchDocuments,
  fetchSnapshot,
  updateDocument,
} from "../../lib/firebaseFirestore";
import { isValidEmail } from "../../lib/helpers";
import { colors } from "../../lib/theme";
import FormListContainer from "../common/FormList/FormListContainer";
import FormListSeparator from "../common/FormList/FormListSeparator";
import HeaderAddButton from "../common/HeaderAddButton";
import SafeContainer from "../common/SafeContainer";
import Text from "../common/Text";

const SharingAccount = () => {
  const navigation = useNavigation();
  const { user } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [listOfRequests, setListOfRequests] = useState<ShareRequest[]>([]);

  useLayoutEffect(() => {
    let docUnsubscribe: null | Unsubscribe = null;

    if (navigation && user) {
      const isAccessingOtherAccount = user.email !== user.sharedAccounId;
      if (!isAccessingOtherAccount) {
        navigation.setOptions({
          headerRight: () => (
            <HeaderAddButton
              isLoading={loading}
              onPress={() => showPrompt("", "Enter the user's email address.")}
            />
          ),
        });
      } else {
        navigation.setOptions({
          headerRight: () => null,
        });
      }

      docUnsubscribe = fetchSnapshot<ShareRequest>(
        COLLECTION_REQUESTS,
        {
          whereClauses: [
            { field: "sender", value: user.email, operator: "==" },
          ],
        },
        (data) => {
          setListOfRequests(data);
        }
      );
    }

    return () => {
      if (docUnsubscribe) docUnsubscribe();
    };
  }, [navigation, user, loading]);

  if (!user) return null;

  const showPrompt = (defaultValue: string, message: string) => {
    Alert.prompt(
      "Share Your Account",
      message,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Send",
          onPress: (text: string | undefined) => handleAdd(text),
          style: "default",
          isPreferred: true,
        },
      ],
      "plain-text",
      defaultValue,
      "email-address"
    );
  };

  const handleAdd = async (text: string | undefined) => {
    if (!text) return;
    if (!text.trim()) return;
    if (text === user.email) {
      Alert.alert("Error", "You can't share your account with yourself.");
      return;
    }

    setLoading(true);

    const isValid = isValidEmail(text);
    if (isValid) {
      const existingUser = await fetchDocuments(COLLECTION_REQUESTS, {
        whereClauses: [
          { field: "sender", value: user.email, operator: "==" },
          { field: "receiver", value: text, operator: "==" },
          {
            field: "status",
            value: ["pending", "accepted", "rejected"],
            operator: "in",
          },
        ],
      });

      if (existingUser.length > 0) {
        showPrompt(
          text,
          "You already have sent a request to this email address. Revoke your request before sending a new one."
        );
      } else {
        const canceledUser = await fetchDocuments<ShareRequest>(
          COLLECTION_REQUESTS,
          {
            whereClauses: [
              { field: "sender", value: user.email, operator: "==" },
              { field: "receiver", value: text, operator: "==" },
              {
                field: "status",
                value: "cancelled",
                operator: "==",
              },
            ],
          }
        );

        const status: StatusRequest = "pending";

        if (canceledUser.length > 0) {
          const oldRequest = canceledUser[0];
          await updateDocument(COLLECTION_REQUESTS, oldRequest.id, {
            status,
          });
        } else {
          const data: ShareRequestFirestore = {
            senderName: `${user.firstName} ${user.lastName}`,
            sender: user.email,
            receiver: text,
            status,
            updatedAt: new Date(),
            createdAt: new Date(),
          };
          await addDocument<ShareRequestFirestore>(COLLECTION_REQUESTS, data);
        }
      }
      setLoading(false);
    } else {
      setLoading(false);
      showPrompt(text, "Please enter a valid email address.");
      return;
    }
  };

  const revoqueRequest = async (request: ShareRequest) => {
    Alert.alert(
      "Revoke Request",
      "Are you sure you want to cancel this request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Revoke",
          onPress: () => handleRevoke(request),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const handleRevoke = async (request: ShareRequest) => {
    const status: StatusRequest = "cancelled";
    const userEmail = request.receiver;

    const receivingUser = await fetchDocuments<User>(COLLECTION_USER, {
      whereClauses: [
        { field: "email", value: userEmail, operator: "==" },
        { field: "sharedAccounId", value: user.email, operator: "==" },
      ],
    });

    if (receivingUser.length > 0) {
      const userToUpdate = receivingUser[0];
      await updateDocument(COLLECTION_USER, userToUpdate.id, {
        sharedAccounId: userToUpdate.email,
        sharedAccounName: "",
      });
    }

    await updateDocument(COLLECTION_REQUESTS, request.id, {
      status,
    });
  };

  return (
    <SafeContainer hasHeader>
      <Text style={styles.aboutTxt}>
        You can share your account with another person by providing their email
        address. Whether they are registered or not, they will receive a
        notification once they have an account.
      </Text>
      <FormListContainer style={styles.container}>
        {listOfRequests.map((request, i) => {
          const isLastItem = listOfRequests.length === i + 1;
          let statusColor = colors.red;
          if (request.status === "accepted") statusColor = colors.green;
          if (request.status === "pending") statusColor = colors.grayLight;

          return (
            <Fragment key={request.id}>
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => revoqueRequest(request)}
              >
                <View style={styles.itemLeft}>
                  <Text fontWeight="800" style={styles.itemLeftEmail}>
                    {request.receiver}
                  </Text>
                  <Text style={styles.itemLeftDate}>
                    {formatDate(request.createdAt)}
                  </Text>
                  <View
                    style={[
                      styles.itemLeftStatus,
                      { backgroundColor: statusColor },
                    ]}
                  >
                    <Text fontWeight="900" style={styles.itemLeftStatusText}>
                      {request.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.itemRight}>
                  <SFSymbol
                    size={10}
                    name="chevron.right"
                    colors={[colors.grayLight]}
                  />
                </View>
              </TouchableOpacity>
              {!isLastItem && <FormListSeparator />}
            </Fragment>
          );
        })}
      </FormListContainer>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  aboutTxt: {
    color: colors.grayLight,
    lineHeight: 20,
    fontSize: 16,
  },
  container: {
    padding: 0,
    flex: 1,
    marginTop: 30,
  },
  itemContainer: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemLeft: {},
  itemLeftEmail: {
    fontSize: 18,
  },
  itemLeftDate: {
    fontSize: 13,
    color: colors.grayLight,
  },
  itemLeftStatus: {
    alignSelf: "flex-start",
    borderRadius: 5,
    marginTop: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  itemLeftStatusText: {
    color: colors.darker,
    fontSize: 12,
  },
  itemRight: {
    marginRight: 10,
  },
});

export default SharingAccount;
