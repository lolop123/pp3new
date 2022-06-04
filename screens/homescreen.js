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
  var theBigDay = new Date(2000, 1, 2);
  const [reload, setReload] = useState(0);
  
  useEffect(() => {
    const  getcurrPlace = async () => {
     
         const docRef = await doc(db, "people", auth.currentUser?.email);
      const docSnap = await getDoc(docRef);
      console.log('-------')
      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);
      let numberMinusDays = docSnap.data().date.toDate().setHours(0,0,0,0) - today.setHours(0,0,0,0);
      console.log(( numberMinusDays) / (1000 * 60 * 60 * 24))
    if(( numberMinusDays) / (1000 * 60 * 60 * 24) > 0 ){
      console.log('Using')
      setplaceStatus('Using');
    }
    else if(( numberMinusDays) / (1000 * 60 * 60 * 24) < 1 && ( numberMinusDays) / (1000 * 60 * 60 * 24) > -50 ){
      setplaceStatus('Free') ; console.log('free')
    }
    else if(( numberMinusDays) / (1000 * 60 * 60 * 24) < -50){
      setplaceStatus('Not sharing')
    }
     
      
     if (docSnap.data().permPlace == 0) {
        setpermPlace('Please enter your permanent place')
      } else {
        setpermPlace(docSnap.data().permPlace)
      }
      console.log('entered effect'+ docSnap.data().date.toDate())
      setShareDateStart( docSnap.data().date.toDate().toLocaleDateString('en-us'));
      if (docSnap.data().dateMax.toDate().setHours(0,0,0,0) == theBigDay.setHours(0,0,0,0)) {
        setshareDateEnd(' ')
      } else {
        setshareDateEnd(docSnap.data().dateMax.toDate().toLocaleDateString('en-us'));
      }
      
    
  
    console.log("get" + permanentPlace);
    if (docSnap.data().permPlace == 0) {
      setPermPlaceVisible(true)
    } else {
      setPermPlaceVisible(false)
    }
    if (docSnap.data().date.toDate().setHours(0,0,0,0) == theBigDay.setHours(0,0,0,0)) {
      setSharePlaceVisible(false)
    } else {
      setSharePlaceVisible(true)
    }
    
  }
  getcurrPlace()
  }, [reload]);

  


    
  async function settPlace() {
    const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));
    const docData = {
      currentPlace: 0,
      mail: auth.currentUser?.email,
      permPlace: parkingPlace,
      date: docSnap.data().date,
      dateMax : docSnap.data().dateMax,
      statusOfPermPla: "Added",
      searchStatus: docSnap.data().searchStatus
    };
    
    setDoc(doc(db, "people", auth.currentUser?.email), docData);
    setpermPlace(parkingPlace);
    setReload(oldKey => oldKey +1);
   
    
    
  }


  const [parkingPlace, setPlace] = useState("");
  const [currPlace, setcurrPlace] = useState("");
  const [permanentPlace, setpermPlace] = useState("");
  const [placeStatus, setplaceStatus] = useState("Using");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisibleMax, setDatePickerVisibilityMax] = useState(false);
  const [isPermPlaceVisible, setPermPlaceVisible] = useState(false);
  const [isSharePlaceVisible, setSharePlaceVisible] = useState(false);
  const [shareDateStart, setShareDateStart] = useState("");
  const [shareDateEnd, setshareDateEnd] = useState("");
  
  const showPlaceSetButton = () => {
    setPermPlaceVisible(true);
  };

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
      permPlace: docSnap.data().permPlace,
      date: date ,
      dateMax : docSnap.data().dateMax,
      statusOfPermPla: placeStatus,
      searchStatus: docSnap.data().searchStatus
    };
    try {
      setDoc(doc(db, "people", auth.currentUser?.email), docData);
   }
   catch (e) {
     
      logMyErrors(e); 
   }
    hideDatePicker();
    
    console.log('huiiiiii ' + shareDateStart);
    setReload(oldKey => oldKey +2);



  };
  
  const handleConfirmMax = async  (date) => {
    console.log("A max date has been picked: ", date);
   
    const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));

    const docData = {
      currentPlace: currPlace,
      mail: auth.currentUser?.email,
      permPlace: docSnap.data().permPlace,
      date: docSnap.data().date,
      dateMax: date,
      statusOfPermPla: "free",
      searchStatus: docSnap.data().searchStatus,
    };
    setDoc(doc(db, "people", auth.currentUser?.email), docData);
    hideDatePickerMax();
    setReload(oldKey => oldKey +2);
    
    
  };

  const navigation = useNavigation();

  
  

  const handleSignOut = async () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };
  
  async function getpermPlace() {
    const docRef = doc(db, "people", "lol@gmail.com");
    const docSnap = await getDoc(docRef);

    //console.log("Document data:", docSnap.data().permPlace);
    setpermPlace(docSnap.data().permPlace);
  }

  async function dontShareF() {
    const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));
    
    const docData = {
      currentPlace: docSnap.data().currentPlace,
      mail: auth.currentUser?.email,
      permPlace: docSnap.data().permPlace,
      date: theBigDay,
      dateMax: theBigDay,
      statusOfPermPla: docSnap.data().statusOfPermPla,
      searchStatus: docSnap.data().searchStatus,
    };
    try {
      setDoc(doc(db, "people", auth.currentUser?.email), docData);
   }
   catch (e) {
      
      logMyErrors(e); 
   }
   setReload(oldKey => oldKey +1);
  }
  


  return (
    
    <View style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
     
      <Text>Your place:</Text>
      <View style={styles.double}>
        <TextInput
          placeholder={permanentPlace}
          value={parkingPlace}
          onChangeText={(text) => setPlace(text)}
          keyboardType = 'numeric'

        />
        <TouchableOpacity onPress={showPlaceSetButton} style={styles.buttonEddit}>
          <Text style={styles.buttonText}>ed</Text>
        </TouchableOpacity>
      </View>
      {isPermPlaceVisible ? (
      <TouchableOpacity  onPress={settPlace} style={styles.button}>
        <Text style={styles.buttonText}>sett</Text>
      </TouchableOpacity>  ) : null}
      <Text>Your place status: {placeStatus}</Text>
      {isSharePlaceVisible ? (
      <Text>You will share place from: {shareDateStart} to {shareDateEnd} </Text> 
      ) : null}
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
      
      
      <TouchableOpacity onPress={dontShareF} style={styles.button}>
        <Text style={styles.buttonText}>Dont share</Text>
      </TouchableOpacity>
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
  double: {
    position: 'relative',
    
  },
  buttonEddit:{
    display: "flex",
    backgroundColor: "#0782F9"
  },
});
