import * as Contacts from 'expo-contacts';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import AddButton from '../components/AddButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants';
import app from '../config/firebaseConfig'
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';

import Contact from '../components/Contact';

// Function to format phone number as (###) ###-####
const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
};

const Network = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [network, setNetwork] = useState([]);
  const db = app.db;
  const user = app.auth.currentUser;
  const [isLoading, setIsLoading] = useState(true);
  const emptyMessage = "You don’t have any supports added yet, click the blue plus sign to add one!";
  const [addModal, setAddModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleAddModal = (contact) => {
    setAddModalVisible(!addModal);
    setSelectedContact(contact);
    
  }

  const getNetwork = async () => {
    setIsLoading(true);

    if (user) {
      const networkRef = doc(db, 'network', user.uid);
      
      try {
        const networkDoc = await getDoc(networkRef);
        const networkData = networkDoc.data()?.network || [];
        
        setNetwork(networkData.map((contact, index) => ({ 
          id: index.toString(), 
          fname: contact.fname, 
          lname: contact.lname, 
          level: contact.level, 
          phone: contact.phone 
        })));
      } catch (error) {
        console.error('Error fetching network document:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.FirstName, Contacts.Fields.PhoneNumbers]
        });

        // Remove country code from phone numbers and format them
        const formattedContacts = data.map(contact => ({
          ...contact,
          phoneNumbers: contact.phoneNumbers ? contact.phoneNumbers.map(phone => ({
            ...phone,
            number: phone.number.replace(/^\+?1?/, '') // Remove +1 country code and leading 1
          })) : []
        }));

        setContacts(formattedContacts);
        setFilteredContacts(formattedContacts);
      }
      
    })();
  }, []);

  useEffect(() => {
    // Filter contacts based on searchQuery
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredContacts(filtered);
    getNetwork();
  }, [searchQuery]);

  return (
    <View style={styles.overCon}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>My Network</Text>
          {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primaryColor} />
            ) : network.length === 0 ? (
              <View style={styles.emptyMessageConatiner}>
                <Text style={styles.emptyMessage}>{emptyMessage}</Text>
              </View>
            ) : (
              network.map((contact) => (
                <View key={contact.id}>
                  <Text>{contact.fname + " " + contact.lname + " " + contact.phone}</Text>
                </View>
              ))
            )}
        </View>
      </ScrollView>
      <AddButton onPress={toggleModal}/>
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          {errorMessage !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <MaterialCommunityIcons name="close" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Contact</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name..."
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
            />
            <ScrollView style={styles.scrollContainer}>
              {filteredContacts.map((contact, index) => (
                <Contact
                key={index}
                name={contact.name}
                phone={contact.phoneNumbers && contact.phoneNumbers.length > 0 ? formatPhoneNumber(contact.phoneNumbers[0].number) : 'No Phone Number'}
                onPress={() => toggleAddModal(contact)}
              />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal visible={addModal} transparent animationType="fade">
        <View style={styles.addModalContainer}>
          <View style={styles.addModalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleAddModal}>
              <MaterialCommunityIcons name="close" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Contact</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Add Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overCon:{
    height: '100%',
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 10,
    backgroundColor: "white"
  },
  scrollContainer: {
    flexGrow: 1,
    width: '90%',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    width: '100%'
  },
  modalContent: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%', // Adjusted to take up 90% of the screen height
    paddingHorizontal: 20, // Added horizontal padding
    paddingTop: 40, // Added top padding
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 20,
    borderRadius: 5,
  },
  addModalContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  addModalContent: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
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
    fontWeight: 'bold'
    },
});

export default Network;
