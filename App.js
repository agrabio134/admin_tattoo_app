import React, { useEffect, useState } from "react";
import { StyleSheet, Platform } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "./Screen/LoginScreen";
import ApprovedAppointmentScreen from "./Screen/ApprovedAppointmentScreen";
import AppointmentScreen from "./Screen/AppointmentScreen";
import DeletedAppointmentScreen from "./Screen/DeletedAppointmentScreen";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

const Tab = createBottomTabNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyBZvgTJK1oQfqzx8m-RD7rLQPx_i__Z6X4",
  authDomain: "tattoo-appointment-254ae.firebaseapp.com",
  databaseURL:
    "https://tattoo-appointment-254ae-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tattoo-appointment-254ae",
  storageBucket: "tattoo-appointment-254ae.appspot.com",
  messagingSenderId: "279786016572",
  appId: "1:279786016572:web:70c722e708588793a25839",
  measurementId: "G-3CM6F9ZHXL",
};

firebase.initializeApp(firebaseConfig);

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F8F7F4",
    text: "#fff",
    card: "#121212",
    border: "#928b97",
  },
};

const iconColor = "#ddd9ce";

const App = () => {
  const [user, setUser] = useState(null);
  const handleLoginSuccess = (user) => {
    setUser(user);
  };

  const db = firebase.firestore(); // Initialize the firestore module

  // connect to fcm
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  // register for push notification
  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;

      db.collection("token").add({
        token: token,
      });
    } else {
      console.log("Must use physical device for Push Notifications");

      return;
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  // notify device fcm whenever there is a new appointment added to the database
  useEffect(() => {
    const unsubscribe = db.collection("appointment").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const currentAppointment = change.doc.data();
          sendPushNotification(currentAppointment);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  // send push notification to the device
  const sendPushNotification = async (appointment) => {
    const message = {
      to: appointment.pushToken,
      sound: "default",
      title: "New Appointment",
      body: `You have a new appointment on ${appointment.date} at ${appointment.time}`,
      data: { data: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip,deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  return (
    <NavigationContainer theme={MyTheme}>
      {user ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, size }) => {
              if (route.name === "Accepted Appointment") {
                return (
                  <Ionicons
                    name={
                      focused ? "checkmark-circle" : "checkmark-circle-outline"
                    }
                    size={size}
                    color={iconColor}
                  />
                );
              } else if (route.name === "Pending Appointment") {
                return (
                  <Ionicons
                    name={focused ? "calendar" : "calendar-outline"}
                    size={size}
                    color={iconColor}
                  />
                );
              } else if (route.name === "Declined Appointment") {
                return (
                  <Ionicons
                    name={focused ? "trash" : "trash-outline"}
                    size={size}
                    color={iconColor}
                  />
                );
              }
            },
            tabBarInactiveTintColor: "gray",
            tabBarActiveTintColor: "tomato",
          })}
        >
          <Tab.Screen
            name="Accepted Appointment"
            component={ApprovedAppointmentScreen}
            options={{
              tabBarLabel: "",
            }}
          />
          <Tab.Screen
            name="Pending Appointment"
            component={AppointmentScreen}
            options={{
              tabBarLabel: "",
            }}
          />
          <Tab.Screen
            name="Declined Appointment"
            component={DeletedAppointmentScreen}
            options={{
              tabBarLabel: "",
            }}
          />
        </Tab.Navigator>
      ) : (
        <LoginScreen firebaseApp={firebase} onLoginSuccess={handleLoginSuccess} />

      
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
