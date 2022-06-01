import {
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth1, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIIVbdOEjWAxRhfYseea_kGf6SALoOBhE",
  authDomain: "parking-5ed0e.firebaseapp.com",
  projectId: "parking-5ed0e",
  storageBucket: "parking-5ed0e.appspot.com",
  messagingSenderId: "142686564658",
  appId: "1:142686564658:web:5b294c1315ff4e0850272b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [switcherStatus, setswitcherStatus] = useState(0);

  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && (switcherStatus == 1)) {
        navigation.replace("Home");
      } else if(user && (switcherStatus == 0)){
        navigation.replace("Search");
      }
    });

    return unsubscribe;
  });

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with:", user.email);
      })
      .catch((error) => alert(error.message));
    navigation.replace("Home");
  };

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
      })
      .catch((error) => alert(error.message));
    sendSearchStatus();
  };

  async function sendSearchStatus() {
    console.log("get start");
    const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));
    const docData = {
      currentPlace: docSnap.data().currentPlace,
      mail: auth.currentUser?.email,
      permPlace: docSnap.data().permPlace,
      date: docSnap.data().date,
      dateMax: docSnap.data().dateMax,
      statusOfPermPla: docSnap.data().statusOfPermPla,
      searchStatus: switcherStatus,
    };

    setDoc(doc(db, "people", auth.currentUser?.email), docData);
    console.log("sended" + switcherStatus);
    console.log("login end");
  }

  const optionsOFSwitcher = [
    { label: "I have place", value: 0 },
    { label: "Ill search place", value: 1 },
  ];
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <SwitchSelector
          options={optionsOFSwitcher}
          initial={0}
          onPress={(value) => setswitcherStatus(value)}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});
