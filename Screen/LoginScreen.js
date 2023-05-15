import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
} from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";


const adminFirebaseConfig = {
  apiKey: "AIzaSyDJlsqDnzaMd8m637n3Ef0HF5Qh559YCus",
  authDomain: "tattoo-admin-167cd.firebaseapp.com",
  projectId: "tattoo-admin-167cd",
  storageBucket: "tattoo-admin-167cd.appspot.com",
  messagingSenderId: "17261405028",
  appId: "1:17261405028:web:7b9fa10ec13b96c3615071",
  measurementId: "G-DQ6BCFVN9F",
};
const adminFirebaseApp = firebase.initializeApp(adminFirebaseConfig, "admin");
const LoginScreen = ({ firebaseApp, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    
    try {
      // Login user using the admin Firebase app instance
      const auth = adminFirebaseApp.auth();
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      onLoginSuccess(userCredential.user);
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
        <Image
      source={require("../assets/icon.png")}
      resizeMode="contain"
      style={styles.profile}
    />
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#a3a3a3"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#a3a3a3"
      />
      {/* Remember me button */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
       
        </View>
      </View>
      <View style={styles.buttonLogin}>
        <Button title="Login" onPress={handleLogin} color="#00be67" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
  },
  input: {
    color: "#fff",
    height: 40,
    width: 230,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
  },
  profile: {
    width: 150,
    height: 200,
    alignSelf: "center",
  },
  buttonLogin: {
    width: 230,
    height: 40,
    alignSelf: "center",
    marginTop: 16,
  },
});

export default LoginScreen;
