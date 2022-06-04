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
import SwitchSelector from "react-native-switch-selector";

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
  var theBigDay = new Date(2000, 1, 2);
  const navigation = useNavigation();
  const [switcherStatus, setswitcherStatus] = useState(1);

  const handleSignOut = async () => {
      auth
        .signOut()
        .then(() => {
          navigation.replace("Login");
        })
        .catch((error) => alert(error.message));
    };


    const optionsOFSwitcher = [
      { label: "Just not for long", value: 0 },
      { label: "long-term", value: 1 },
    ];
    async function searchFreePlace() {
      console.log("get start");
      const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));
      const placesPool = collection(db, "people");
      const placesSnapshot = await getDocs(placesPool);
      const placesList = placesSnapshot.docs.map((doc) => doc.data());
      
      var fruits = placesList.filter(human => human.date.toDate().toLocaleDateString('en-us')  != theBigDay.toLocaleDateString('en-us'))
      console.log(fruits[0])
    }

return (
  
  <View style={styles.container}>
    <Text>hello</Text>
    <SwitchSelector
        options={optionsOFSwitcher}
        initial={0}
        onPress={(value) => setswitcherStatus(value)}
      />
    <TouchableOpacity onPress={searchFreePlace} style={styles.button}>
      <Text style={styles.buttonText}>Search free place</Text>
    </TouchableOpacity>
   
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