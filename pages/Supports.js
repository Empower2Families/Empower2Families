// Supports.js

import { doc, getDoc, setDoc, } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddButton from '../components/AddButton';
import ListItem from '../components/ListItem';
import app from '../config/firebaseConfig';
import { COLORS } from '../constants';

const Supports = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [supportText, setSupportText] = useState('');
  const db = app.db;
  const auth = app.auth;
  const user = app.auth.currentUser;
  const [supports, setSupports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const addSupport = async () => {
    try {
      const userRef = doc(db, 'supports', user.uid);
  
      // Get the current supports array from the document
      const userDoc = await getDoc(userRef);
      const currentSupports = userDoc.data()?.supports || [];
  
      // Add the new support to the array
      currentSupports.push(supportText);
  
      // Update the document with the modified array
      await setDoc(userRef, {
        supports: currentSupports,
      });
  
      // Refresh the supports array
      getSupports();
    } catch (error) {
      console.log(error);
    }
  
    toggleModal(); // Close the modal after adding support
  };

  const getSupports = async () => {
    setIsLoading(true);
    if (user) {
      const supportsRef = doc(db, 'supports', user.uid);
      
      try {
        const supportsDoc = await getDoc(supportsRef);
        const supportsData = supportsDoc.data()?.supports || [];
        
        setSupports(supportsData.map((support, index) => ({ id: index.toString(), text: support })));
      } catch (error) {
        console.error('Error fetching supports document:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

 useEffect(() => {
  getSupports();
}, []);



  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.overCon}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Supports</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primaryColor} />
          ) : (
            supports.map((support) => (
              <ListItem key={support.id} text={support.text} />
            ))
          )}
          <TouchableOpacity onPress={navigateToHome}>
            <Text>Go Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AddButton onPress={toggleModal} />
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
          <MaterialCommunityIcons name="close" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Support</Text>
            <Text style={styles.info}>A support can be things that are goind good, or things that make you stronger/better!</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your support here ..."
              onChangeText={(text) => setSupportText(text)}
            />
            <Pressable style={styles.button} onPress={addSupport}>
              <Text style={styles.buttonText}>Add Support</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overCon:{
    height: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    width: 'auto',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 12
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius:5,
    backgroundColor: COLORS.primaryColor,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    height: 60,
    width: 180
  },
  buttonText: {
    color: COLORS.lightText,
    fontWeight: '900'
    },
  info: {
    color: 'grey',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 12
  },
    // Style for the 'X' button
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 50,
      zIndex: 1,
    },
  
    closeButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
    },
});

export default Supports;
