import { TouchableOpacity,KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc , doc, getDoc, Timestamp } from 'firebase/firestore';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyDIIVbdOEjWAxRhfYseea_kGf6SALoOBhE",
  authDomain: "parking-5ed0e.firebaseapp.com",
  projectId: "parking-5ed0e",
  storageBucket: "parking-5ed0e.appspot.com",
  messagingSenderId: "142686564658",
  appId: "1:142686564658:web:5b294c1315ff4e0850272b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth =   getAuth();



const HomeScreen = () => {
 
  console.log('-------');
  
  const [parkingPlace, setPlace] = useState('')
  const [currPlace, setcurrPlace] = useState('')
  const [permanentPlace, setpermPlace] = useState('')
  
  const navigation = useNavigation()
  
   getcurrPlace().then(()=> settPlace());
 // getpermPlace();
  //settPlace();
  
 
  const handleSignOut = async () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }
  async function getPlace() {
    const citiesCol = collection(db, 'places');
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    
    //console.log(cityList);

  }
   async function getcurrPlace() {
    const docRef = doc(db, "people", "lol@gmail.com");
    const docSnap = await getDoc(docRef);
    
    // console.log("Document data:", docSnap.data().currentPlace);
    console.log(1);
    setcurrPlace(docSnap.data().currentPlace)
    console.log(2);
    console.log('get' + currPlace);

  }
  async function getpermPlace() {
    const docRef = doc(db, "people", "lol@gmail.com");
    const docSnap = await getDoc(docRef);
    
     //console.log("Document data:", docSnap.data().permPlace);
    setpermPlace(docSnap.data().permPlace)
  }

  async function settPlace() {
    console.log('set' + currPlace);
    
    const docData  =  {
      currentPlace: currPlace,
      mail: auth.currentUser?.email,
      permPlace: permanentPlace,
      date: Timestamp.fromDate(new Date("December 5, 1315")),   
  };
  console.log(3);
  await setDoc(doc(db, "people", "lol@gmail.com"), docData);
  console.log(4);
}

  
  return (
    <View style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
      <Text>Your current place: {currPlace}</Text>
      <Text>Your permanent place: {permanentPlace}</Text>
      <TextInput
          placeholder="Place"
           value={parkingPlace}
          onChangeText={text => setPlace(text)}
          style={styles.input}
        />
      <TouchableOpacity
       onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      <TouchableOpacity
       onPress={getPlace}
        style={styles.button}
      >
        <Text style={styles.buttonText}>My place</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={getcurrPlace}
        style={styles.button}
      >
        <Text style={styles.buttonText}>chek my place</Text>
      </TouchableOpacity>
    </View>
    
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
   button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})