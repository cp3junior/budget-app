import { Stack } from "expo-router";
import React, { Fragment, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import FormListButtonLink from "../../components/common/FormList/FormListButtonLink";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import HeaderAddButton from "../../components/common/HeaderAddButton";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import { useAppContext } from "../../hook/useAppContext";
import { COLLECTION_LOCATIONS } from "../../lib/constant";
import {
  addDocument,
  deleteDocument,
  updateDocument,
} from "../../lib/firebaseFirestore";
import { colors } from "../../lib/theme";

const LocationsScreen = () => {
  const { user, locations } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const showPrompt = (
    defaultValue: string,
    message: string,
    isAdd = true,
    location?: LocationItem
  ) => {
    Alert.prompt(
      "Location",
      message,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: (text: string | undefined) =>
            isAdd ? handleAdd(text) : handleEdit(text, location),
          style: "default",
          isPreferred: true,
        },
      ],
      "plain-text",
      defaultValue
    );
  };

  const handleShowAddPrompt = () => {
    showPrompt("", "Enter the location name.");
  };

  const handleShowEditPrompt = (location: LocationItem) => {
    showPrompt(location.name, "Edit location.", false, location);
  };

  const showDeletePrompt = (location: LocationItem) => {
    Alert.alert("Delete location", "Are you sure you want to delete this?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => handleDelete(location),
        style: "destructive",
      },
    ]);
  };

  const handleDelete = async (location: LocationItem) => {
    setIsLoading(true);
    await deleteDocument(COLLECTION_LOCATIONS, location.id);
    setIsLoading(false);
  };

  const handleEdit = async (
    text: string | undefined,
    location?: LocationItem
  ) => {
    if (!text) return;
    if (!location) return;
    if (!text.trim()) return;
    setIsLoading(true);

    await updateDocument(COLLECTION_LOCATIONS, location.id, {
      name: text.trim(),
    });
    setIsLoading(false);
  };

  const handleAdd = async (text: string | undefined) => {
    if (!text) return;
    if (!text.trim()) return;
    setIsLoading(true);

    const fountExisting = locations.find(
      (loc) => loc.name.trim() === text.trim()
    );
    if (fountExisting) {
      showPrompt(text, "Location already exists.");
      setIsLoading(false);
      return;
    }

    const data: LocationItemFirestore = {
      sharedAccounId: user.sharedAccounId,
      name: text.trim(),
      createdAt: new Date(),
    };
    await addDocument<LocationItemFirestore>(COLLECTION_LOCATIONS, data);

    setIsLoading(false);
  };

  const sortedLocations = locations.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  return (
    <SafeContainer hasHeader>
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderAddButton
              isLoading={isLoading}
              onPress={handleShowAddPrompt}
            />
          ),
        }}
      />

      <Text style={styles.textInfo}>
        Locations are the places you frequently visit or do your shopping. This
        list helps you quickly access your preferred places, making your
        experience on the DollarDazzle more efficient and personalized.
      </Text>
      <Text style={styles.textInfoDisc}>
        Press or hold one location to Edit or Delete.
      </Text>
      <View style={styles.container}>
        <FormListContainer style={styles.containerStyle}>
          {sortedLocations.map((loc, index) => {
            const showSeparator: boolean = sortedLocations.length !== index + 1;
            return (
              <Fragment key={loc.id}>
                <FormListButtonLink
                  label={loc.name}
                  href=""
                  onPress={() => handleShowEditPrompt(loc)}
                  onLongPress={() => showDeletePrompt(loc)}
                />
                {showSeparator && <FormListSeparator />}
              </Fragment>
            );
          })}
        </FormListContainer>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: 0,
    flex: 1,
    marginBottom: 30,
  },
  container: { flex: 1, marginBottom: 60 },
  textInfo: {
    color: colors.grayLight,
    marginBottom: 10,
    fontSize: 16,
  },
  textInfoDisc: {
    color: colors.grayLight,
    marginBottom: 20,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default LocationsScreen;
