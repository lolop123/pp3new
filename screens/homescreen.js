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



const HomeScreen = () => {

  async function getcurrPlace() {
    const docRef = doc(db, "people", "lol@gmail.com");
    const docSnap = await getDoc(docRef);

    if (docSnap.data().permPlace == 'Please enter your permanent place') {
      setpermPlace('Please enter your permanent place')
    } else {
      setpermPlace(docSnap.data().permPlace)
    }
   
    setplaceStatus(docSnap.data().statusOfPermPla);
    console.log("get" + permanentPlace);
    if (permanentPlace == 'Please enter your permanent place') {
      setPermPlaceVisible(true)
    } else {
      setPermPlaceVisible(false)
    }
  }
  async function settPlace() {
    const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));
    const docData = {
      currentPlace: 0,
      mail: auth.currentUser?.email,
      permPlace: parkingPlace,
      date: docSnap.data().date,
      dateMax : docSnap.data().dateMax,
      statusOfPermPla: "free",
    };
    
    setDoc(doc(db, "people", auth.currentUser?.email), docData);
    setpermPlace(parkingPlace);
    
  }
  console.log("-------");

  const [parkingPlace, setPlace] = useState("");
  const [currPlace, setcurrPlace] = useState("");
  const [permanentPlace, setpermPlace] = useState("");
  const [placeStatus, setplaceStatus] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisibleMax, setDatePickerVisibilityMax] = useState(false);
  const [isPermPlaceVisible, setPermPlaceVisible] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const showDatePickerMax = () => {
    setDatePickerVisibilityMax(true);
  };

  const hideDatePickerMax = () => {
    setDatePickerVisibilityMax(false);
  };

  const handleConfirm = async (date) => {
    console.log("A min date has been picked: ", date);
    const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));
    const docData = {
      currentPlace: currPlace,
      mail: auth.currentUser?.email,
      permPlace: permanentPlace,
      date: date ,
      dateMax : docSnap.data().dateMax,
      statusOfPermPla: "free",
    };
    
    setDoc(doc(db, "people", auth.currentUser?.email), docData);
    hideDatePicker();
  };
  
  const handleConfirmMax = async  (date) => {
    console.log("A max date has been picked: ", date);
   
    const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));

    const docData = {
      currentPlace: currPlace,
      mail: auth.currentUser?.email,
      permPlace: permanentPlace,
      date: docSnap.data().date,
      dateMax: date,
      statusOfPermPla: "free",
    };
    setDoc(doc(db, "people", auth.currentUser?.email), docData);
    hideDatePickerMax();
  };

  const navigation = useNavigation();

  getcurrPlace();
  

  const handleSignOut = async () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };
  async function getPlace() {
    const citiesCol = collection(db, "places");
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map((doc) => doc.data());

    //console.log(cityList);
  }
  async function getpermPlace() {
    const docRef = doc(db, "people", "lol@gmail.com");
    const docSnap = await getDoc(docRef);

    //console.log("Document data:", docSnap.data().permPlace);
    setpermPlace(docSnap.data().permPlace);
  }

  return (
    <View style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
      <Text>Your current place: {currPlace}</Text>
      {/* <Text>Your current place: {currPlace}</Text> */}
      <Text> {permanentPlace}</Text>
      <TextInput
        placeholder={permanentPlace}
        value={parkingPlace}
        onChangeText={(text) => setPlace(text)}
        
      />
      <Text>Your place status: {placeStatus}</Text>
      <TouchableOpacity onPress={showDatePicker} style={styles.button}>
        <Text style={styles.buttonText}>set date min</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showDatePickerMax} style={styles.button}>
        <Text style={styles.buttonText}>set date max</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisibleMax}
        mode="date"
        onConfirm={handleConfirmMax}
        onCancel={hideDatePickerMax}
      />
      <TouchableOpacity onPress={getPlace} style={styles.button}>
        <Text style={styles.buttonText}>My place</Text>
      </TouchableOpacity>
      {isPermPlaceVisible ? (
      <TouchableOpacity  onPress={settPlace} style={styles.button}>
        <Text style={styles.buttonText}>sett</Text>
      </TouchableOpacity>  ) : null}
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

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
