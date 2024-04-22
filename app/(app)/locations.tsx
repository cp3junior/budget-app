import { Stack } from "expo-router";
import React, { Fragment, useState } from "react";
import { StyleSheet, View } from "react-native";
import DialogEdit from "../../components/common/DialogEdit";
import FormListButtonLink from "../../components/common/FormList/FormListButtonLink";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import HeaderAddButton from "../../components/common/HeaderAddButton";
import SafeContainer from "../../components/common/SafeContainer";

const locations = [
  "Maximize",
  "Minimize",
  "Maxi",
  "long name location that holds on two lines",
  "long name location that holds on two lines,incase the other one is not long enough",
  "long name location that holds on two lines,incase the other one is not long enough, incase the other one is not long enough, incase the other one is not long enough",
  "Super C",
  "Bonanza",
  "Lonely",
  "Chinese store",
  "Depanneur",
  "2 Super C",
  "2 Bonanza",
  "2 Lonely",
  "2 Chinese store",
  "2 Depanneur",
  "XSuper C",
  "XBonanza",
  "XLonely",
  "XChinese store",
  "XDepanneur",
  "X2 Super C",
  "X2 Bonanza",
  "X2 Lonely",
  "X2 Chinese store",
  "X2 Depanneur",
];

const LocationsScreen = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  return (
    <SafeContainer hasHeader>
      <Stack.Screen
        options={{
          headerRight: () => <HeaderAddButton onPress={handleShow} />,
        }}
      />
      <DialogEdit title="Edit Location" show={show} onClose={handleClose} />
      <View style={styles.container}>
        <FormListContainer style={styles.containerStyle}>
          {locations.map((loc, index) => {
            const canShow: boolean = locations.length !== index + 1;
            return (
              <Fragment key={loc}>
                <FormListButtonLink label={loc} href="" onPress={handleShow} />
                {canShow && <FormListSeparator />}
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
});

export default LocationsScreen;
