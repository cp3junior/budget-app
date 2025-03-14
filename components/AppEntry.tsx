import * as Notifications from "expo-notifications";
import { router, Slot } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { useAuthContext } from "../hook/useAuthContext";

const AppEntry = () => {
  const { authReady, currentUser } = useAuthContext();

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (authReady) {
      if (currentUser) {
        router.replace("/home");
      } else {
        router.replace("/");
      }
      setTimeout(() => {
        setAppReady(true);
      }, 200);
    }
  }, [authReady, currentUser]);

  useEffect(() => {
    const requestNotification = async () => {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status === "granted") {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });
      }
    };

    requestNotification();
  }, []);

  return (
    <>
      {!appReady && (
        <View style={{ flex: 1 }}>
          <Image
            source={require("../assets/splash.png")}
            alt="splash"
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      )}
      <View style={{ flex: 1, display: appReady ? "flex" : "none" }}>
        <Slot />
      </View>
    </>
  );
};

export default AppEntry;
