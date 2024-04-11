import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import app from '../config/firebaseConfig';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { COLORS } from '../constants';

const Account = ({ navigation }) => {
  // Function to handle logout
  const handleLogout = async () => {
    try {
      await app.auth.signOut(); // Sign out the user
      // You can navigate to the login screen or any other screen after logout
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

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
            setLastName(docSnapshot.data().lastName)
          } else {
            console.log('User document not found!');
          }
        })
        .catch((error) => {
          console.error('Error fetching user document:', error);
        });
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfo}>{firstName} {lastName}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfoContainer: {
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Account;
