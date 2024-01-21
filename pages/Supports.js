// Supports.js

import { doc, getDoc, setDoc, } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddButton from '../components/AddButton';
import ListItem from '../components/ListItem';
import app from '../config/firebaseConfig';
import { COLORS } from '../constants';

const Supports = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false); // New state for edit modal
  const [supportText, setSupportText] = useState('');
  const [editedSupportText, setEditedSupportText] = useState(''); // New state for edited support text
  const [editingSupportId, setEditingSupportId] = useState(null); // New state for tracking the support being edited
  const db = app.db;
  const user = app.auth.currentUser;
  const [supports, setSupports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  

  const emptyMessage = "You don’t have any supports added yet, click the blue plus sign to add one!";

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
      if(supportText.length > 0)
      {
        currentSupports.push(supportText);    
        toggleModal(); // Close the modal after adding support
        // Refresh the supports array
        getSupports();
      }
      else
      {
        setErrorMessage('Support left blank.');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }
      setSupportText('');
      
      
  
      // Update the document with the modified array
      await setDoc(userRef, {
        supports: currentSupports,
      });
  

    } catch (error) {
      console.log(error);
    }
  

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

  const deleteSupport = async (id) => {
    try {
      const userRef = doc(db, 'supports', user.uid);
      const userDoc = await getDoc(userRef);
      const currentSupports = userDoc.data()?.supports || [];

      // Remove the support with the specified id
      const updatedSupports = currentSupports.filter((_, index) => index.toString() !== id);

      // Update the document with the modified array
      await setDoc(userRef, {
        supports: updatedSupports,
      });

      // Refresh the supports array
      getSupports();
    } catch (error) {
      console.log(error);
    }
  };

  const editSupport = async (id) => {
    try {
      const userRef = doc(db, 'supports', user.uid);
      const userDoc = await getDoc(userRef);
      const currentSupports = userDoc.data()?.supports || [];
  
      const editedSupportText = await openEditModal(id, currentSupports[id]);
  
      if (editedSupportText !== null) {
        // Update the support with the specified id
        currentSupports[id] = editedSupportText;
  
        // Refresh the supports array
        getSupports();
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const saveEditedSupport = async () => {
    try {
      if (editedSupportText !== undefined && editedSupportText.trim() !== '') {
        const userRef = doc(db, 'supports', user.uid);
        const userDoc = await getDoc(userRef);
        const currentSupports = userDoc.data()?.supports || [];
  
        // Modify the specific element in the array
        currentSupports[editingSupportId] = editedSupportText;
        console.log(editedSupportText);
  
        // Update the document with the modified array
        await setDoc(userRef, {
          supports: currentSupports,
        });
  
        // Close the edit modal
        closeEditModal();
  
        // Refresh the supports array
        getSupports();
      } else {
        console.error('Invalid editedSupportText:', editedSupportText);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  

  const openEditModal = (id, text) => {
    setEditedSupportText(text);
    setEditingSupportId(id);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditedSupportText('');
    setEditingSupportId(null);
    setEditModalVisible(false);
  };

 useEffect(() => {
  getSupports();
}, []);


  return (
    <MenuProvider>
    <View style={styles.overCon}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Supports</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primaryColor} />
          ) : supports.length === 0 ? (
            <View style={styles.emptyMessageConatiner}>
              <Text style={styles.emptyMessage}>{emptyMessage}</Text>
            </View>
          ) : (
            supports.map((support) => (
              <ListItem key={support.id} text={support.text} onDelete={deleteSupport} id={support.id} onEdit={editSupport}/>
            ))
          )}
        </View>
      </ScrollView>
      <AddButton onPress={toggleModal} />
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
        {errorMessage !== '' && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
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
            <TouchableOpacity style={styles.button} onPress={addSupport}>
              <Text style={styles.buttonText}>Add Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={editModalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            {/* ... (your existing code) */}
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeEditModal}>
                <MaterialCommunityIcons name="close" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Support</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your edited support here ..."
                onChangeText={(text) => setEditedSupportText(text)}
                value={editedSupportText}
              />
              <TouchableOpacity style={styles.button} onPress={saveEditedSupport}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  overCon:{
    height: '100%',
    backgroundColor: 'white'
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
    errorText: {
      color: 'red',
      marginBottom: 10,
      textAlign: 'center',
      borderWidth: 2,
      borderColor: 'red',
      borderRadius: 5,
      padding: 10,
      backgroundColor: '#ffe8e9',
      margin: 50,
    },
    emptyMessage: {
      fontSize: 20,
      textAlign: 'center',
      color: 'grey',
      marginTop: '60%',
      width: '60%'
    },
    emptyMessageConatiner: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
});

export default Supports;
