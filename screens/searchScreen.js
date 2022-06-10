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
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalSelector from 'react-native-modal-selector'

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

  const [textInputValue, setTextInputValue] = useState(
    {
      mail: "admin",
      key: 1,
      name: "Joe",
      type: "admin"
    }
  );
  const [datas, setDatas] = useState([
    {
      key: 1,
      name: "Joe",
      type: "admin"
    }
  ]);
  useEffect(() => {
    console.log(textInputValue.mail)

    const  checlDoubles = async () => {

    const placesPool = collection(db, "people");
      const placesSnapshot = await getDocs(placesPool);
      const placesList = placesSnapshot.docs.map((doc) => doc.data());
      
      var fruits = placesList.filter(human => human.takerMail  == auth.currentUser?.email )
      console.log('takers')
      console.log(fruits)

      for (let index = 0; index < fruits.length; index++) {
      
        const docRef = await doc(db, "people", fruits[index].mail);
        const docSnap = await getDoc(docRef);

        const docData = {
          currentPlace: 0,
          mail: docSnap.data().mail,
          permPlace: docSnap.data().permPlace,
          date: docSnap.data().date,
          dateMax : docSnap.data().dateMax,
          statusOfPermPla: "free",
          searchStatus: docSnap.data().searchStatus,
          takingEnd: theBigDay,
          takingStart: theBigDay,
          takerMail: 'admin'
        };
        await setDoc(doc(db, "people", fruits[index].mail), docData);
        console.log('удалили старое')
      }
      

    }
    

    const  setPlace = async () => {
     
      const docRef = await doc(db, "people", textInputValue.mail);
   const docSnap = await getDoc(docRef);

   const docData = {
    currentPlace: 0,
    mail: docSnap.data().mail,
    permPlace: docSnap.data().permPlace,
    date: docSnap.data().date,
    dateMax : docSnap.data().dateMax,
    statusOfPermPla: "free",
    searchStatus: docSnap.data().searchStatus,
    takingEnd: docSnap.data().date,
    takingStart:textInputValue.dateMax,
    takerMail: auth.currentUser?.email
  };
  
  await setDoc(doc(db, "people", textInputValue.mail), docData);
  console.log('вставили новое')
  }
  if (textInputValue.mail != 'admin') {
    checlDoubles();
    setTimeout(setPlace, 500)
    
    
  } else{console.log('mail is admin')}

      }, [textInputValue]);

  
  const navigation = useNavigation();
  const [switcherStatus, setswitcherStatus] = useState(1);
  const handleSignOut = async () => {
      auth
        .signOut()
        .then(() => {
          navigation.replace("Login");
        })
        .catch((error) => alert(error.message));
        await AsyncStorage.setItem(
          'switcherStatusStorage',
          'a'
        );
    };


    const optionsOFSwitcher = [
      { label: "Just not for long", value: 0 },
      { label: "long-term", value: 1 },
    ];
    async function searchFreePlace() {
      console.log("get start");

      
      const placesPool = collection(db, "people");
      const placesSnapshot = await getDocs(placesPool);
      const placesList = placesSnapshot.docs.map((doc) => doc.data());
      
      var fruits = placesList.filter(human => human.date.toDate().toLocaleDateString('en-us')  != theBigDay.toLocaleDateString('en-us'))
      console.log(fruits)
      fruits.sort((a, b) => a.date - b.date);

      let i = 0;
      fruits.forEach(object => {
        object.date = object.date.toDate().toLocaleDateString('en-us') 
        object.key = i;
        i = i + 1;
      });
      
     
    await setDatas(fruits);
    console.log('---------')
    console.log(datas)
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
    <ModalSelector
                    data={datas}
                    initValue="Select something yummy!"
                    supportedOrientations={['landscape']}
                    accessible={true}
                    scrollViewAccessibilityLabel={'Scrollable options'}
                    cancelButtonAccessibilityLabel={'Cancel Button'}
                    labelExtractor= {item => item.date}

                    onChange={(option)=>{ setTextInputValue(option)}}>
                    
                </ModalSelector>
    
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