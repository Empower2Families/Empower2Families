import * as Contacts from 'expo-contacts';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import AddButton from '../components/AddButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants';
import app from '../config/firebaseConfig'
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import * as Sms from 'expo-sms';


import Contact from '../components/Contact';
import NewMessageButton from '../components/NewMessageButton';

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
  const [selectedTier, setSelectedTier] = useState(1);
  const [isMessageModalVisible, setMessageModalVisible] = useState(false);
  const [messageToSend, setMessageToSend] = useState("");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleAddModal = (contact) => {
    setAddModalVisible(!addModal);
    setSelectedContact(contact);
  }

  const toggleMessageModal = () => {
    setMessageModalVisible(!isMessageModalVisible);
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
          name: contact.name,
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

  const addContactToNetwork = async () => {
    if (user && selectedContact) {
      const networkRef = doc(db, 'network', user.uid);
      const networkDoc = await getDoc(networkRef);
      const networkData = networkDoc.data()?.network || [];
  
      const newContact = {
        name: selectedContact.name,
        phone: selectedContact.phoneNumbers && selectedContact.phoneNumbers.length > 0 ? formatPhoneNumber(selectedContact.phoneNumbers[0].number) : 'No Phone Number',
        level: selectedTier
      };
  
      try {
        await setDoc(networkRef, { network: [...networkData, newContact] });
        // Clear the selectedContact and selectedTier after adding to the network
        setSelectedContact(null);
        setSelectedTier(1);
        setAddModalVisible(false);
        getNetwork();
      } catch (error) {
        console.error('Error adding contact to network:', error);
      }
    }
  };

  const sendMessage = async () => {
    try {
      const tierContacts = network.filter(contact => contact.level === selectedTier);
      const message = messageToSend; // Replace 'Your message here' with the actual message
      const options = {
        recipients: tierContacts.map(contact => contact.phone),
        body: message,
      };
      const isAvailable = await Sms.isAvailableAsync();
      if (isAvailable) {
        await Sms.sendSMSAsync(options);
        console.log('Messages sent successfully');
      } else {
        console.log('SMS is not available on this device');
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
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
        // Iterate over each level
        Array.from({ length: 5 }, (_, index) => {
          const levelContacts = network.filter(contact => contact.level === index + 1);
          if (levelContacts.length > 0) {
            return (
              <View key={index}>
                <Text style={styles.levelHeader}>Tier {index + 1}</Text>
                {levelContacts.map(contact => (
                  <View key={contact.id} style={styles.contactDisplay}>
                  <Text>
                    {contact.name} {contact.phone} {contact.level}
                  </Text>
                  </View>
                ))}
              </View>
            );
          } else {
            return null;
          }
        })
      )}
    </View>
      </ScrollView>
      <NewMessageButton onPress={toggleMessageModal}/>
      <Modal visible={isMessageModalVisible} transparent animationType="fade">
        <View style={styles.messageModalContainer}>
          {/* Modal content */}
          <View style={styles.messageModalContent}>
            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={toggleMessageModal}>
              <MaterialCommunityIcons name="close" size={20} color="#000" />
            </TouchableOpacity>
            {/* Title */}
            <Text style={styles.modalTitle}>Send Message</Text>
            {/* Tier Picker */}
            <Picker
              selectedValue={selectedTier}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setSelectedTier(itemValue)}
            >
              <Picker.Item label="Tier 1" value={1} />
              <Picker.Item label="Tier 2" value={2} />
              <Picker.Item label="Tier 3" value={3} />
              <Picker.Item label="Tier 4" value={4} />
              <Picker.Item label="Tier 5" value={5} />
            </Picker>
            {/* Text Input */}
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here..."
              multiline
              onChangeText={text => setMessageToSend(text)}
            />
            {/* Send button */}
            <TouchableOpacity style={styles.button} onPress={sendMessage}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
            {selectedContact && (
              <View style={styles.selectedContactInfo}>
                <Text>{selectedContact.name}</Text>
                <Text>{selectedContact.phoneNumbers && selectedContact.phoneNumbers.length > 0 ? formatPhoneNumber(selectedContact.phoneNumbers[0].number) : 'No Phone Number'}</Text>
              </View>
            )}
            <Text style={styles.tierText}>Set Tier</Text>
            <Picker
              selectedValue={selectedTier}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedTier(itemValue)
              }>
              <Picker.Item label="1" value={1} />
              <Picker.Item label="2" value={2} />
              <Picker.Item label="3" value={3} />
              <Picker.Item label="4" value={4} />
              <Picker.Item label="5" value={5} />
            </Picker>
            <TouchableOpacity style={styles.button} onPress={addContactToNetwork}>
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
    fontWeight: 'bold',
  },
  levelHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 20
  },
  contactDisplay: {
    fontSize: 14,
    marginBottom: 5
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
  messageModalContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  messageInput: {
    height: 150,
    textAlignVertical: 'top',
    textAlign: 'left',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: COLORS.primaryColor,
    marginBottom: 20,
    width: '90%'
  },
  messageModalContent: {
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
  picker: {
    width: 175,
    height: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black', // You can set the color of the border here
  },
  tierText: {
    marginTop: 20
  }
});

export default Network;
