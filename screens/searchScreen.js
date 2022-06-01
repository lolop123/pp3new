import {
    TouchableOpacity,
    StyleSheet,
    Text,
    TextInput,
    View,
  } from "react-native";
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
  import DateTimePickerModal from "react-native-modal-datetime-picker";
  
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
  
  
  
  const Searchscreen = () => {

    const navigation = useNavigation();

    const handleSignOut = async () => {
        auth
          .signOut()
          .then(() => {
            navigation.replace("Login");
          })
          .catch((error) => alert(error.message));
      };


    
  return (
    
    <View style={styles.container}>
      <Text>hello</Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default Searchscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  input:{
    color: "red",
    fontWeight: "700",
    fontSize: 16,
  },
  
});
