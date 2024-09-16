import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import app from '../config/firebaseConfig';
import SmallButton from "./SmallButton";

const User = ({ navigation }) => {

  const [firstName, setFirstName] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const user = app.auth.currentUser;
    const database = app.db;

    if (user) {
      const userRef = doc(database, 'users', user.uid);

      getDoc(userRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            // User document found, update the state with the user's first name
            setFirstName(docSnapshot.data().firstName);
          } else {
            console.log('User document not found!');
          }
        })
        .catch((error) => {
          console.error('Error fetching user document:', error);
        });
    }

    // Determine time of day and set greeting
    const currentHour = new Date().getHours();
    let greeting;

    if (currentHour >= 5 && currentHour < 12) {
      greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }

    setGreeting(greeting);
  }, []);

  const navigateToChildInfo = () => {
    navigation.navigate("ChildInfo")
  };

  const navigateToAccount = () => {
    navigation.navigate("Account");
  };

  return (
    <View style={userStyles.userContainer}>
      <TouchableOpacity onPress={navigateToAccount}>
        <View style={userStyles.account}>
          <MaterialCommunityIcons name="account-circle" size={40} color="#000" style={userStyles.icon} />
          <View>
            <Text style={userStyles.userName}>Hello, {firstName}!</Text>
            <Text style={userStyles.greeting}>{greeting}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <SmallButton text="Child Info" onPress={navigateToChildInfo} />
    </View>
  );
}

const userStyles = StyleSheet.create({
  userContainer:
  {
    flexDirection: "row",
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  account:
  {
    alignItems: 'center',
    flexDirection: "row",
  },
  userName:
  {
    fontWeight: 'bold',
    fontSize: 15,
    display: 'flex',
    flexWrap: "wrap",
    width: 90
  },
  greeting:
  {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#A3A3A3'
  },
  icon:
  {
    marginRight: 5
  }
});

export default User;
