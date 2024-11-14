import React, {useEffect, useState} from 'react'
import {ScrollView, StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native'
import * as Contacts from 'expo-contacts'
import {Picker} from '@react-native-picker/picker'
import * as Sms from 'expo-sms'
import {useSQLiteContext} from 'expo-sqlite'

import {COLORS} from '@/constants/Colors'
import {MaterialCommunityIcons} from "@expo/vector-icons"
//import NewMessageButton from '@/components/NewMessageButton';

// Function to format phone number as (###) ###-####
function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
}

export default function Network() {
    const db = useSQLiteContext();

    const [contacts, setContacts] = useState([])
    const [filteredContacts, setFilteredContacts] = useState([])
    const emptyMessage = "You don’t have any supports added yet, click the blue plus sign to add one!"

    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);
    const [isMessageModalVisible, setMessageModalVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const [network, setNetwork] = useState([]);
    const [selectedTier, setSelectedTier] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
//    const [messageToSend, setMessageToSend] = useState("");
    const [selectedContact, setSelectedContact] = useState(null);

    const getNetwork = async () => {
        const rows = db.getAllAsync("SELECT * FROM contacts")
        setNetwork((await rows).map((row, index) => ({
            id: index.toString(),
            name: row?.name,
            phone: row?.phone,
            level: row?.level
        })))
    }

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
                await setDoc(networkRef, {network: [...networkData, newContact]});
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


    useEffect(() => {
        async function effect() {
            const {status} = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const {data} = await Contacts.getContactsAsync({
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
        }

        effect();
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
        <View style={styles.overContainer}>

            <ScrollView style={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>My Network</Text>
                    {network.length === 0 ? (
                        <View style={styles.emptyMessageConatiner}>
                            <Text style={styles.emptyMessage}>{emptyMessage}</Text>
                        </View>
                    ) : (
                        // Iterate over each level
                        Array.from({length: 5}, (_, index) => {
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
                                )
                            } else {
                                return null;
                            }
                        })
                    )}
                </View>
            </ScrollView>

            <NewMessageButton onPress={() => setMessageModalVisible(!isMessageModalVisible)}/>

            {/*<Modal visible={isMessageModalVisible} transparent animationType="fade">*/}
            {/*    <View style={styles.messageModalContainer}>*/}
            {/*{/* Modal content */}
            {/*        <View style={styles.messageModalContent}>*/}
            {/*{/* Close button */}
            {/*            <TouchableOpacity style={styles.closeButton} onPress={toggleMessageModal}>*/}
            {/*                <MaterialCommunityIcons name="close" size={20} color="#000"/>*/}
            {/*            </TouchableOpacity>*/}
            {/*{/* Title */}
            {/*            <Text style={styles.modalTitle}>Send Message</Text>*/}
            {/*{/* Tier Picker */}
            {/*            <Picker*/}
            {/*                selectedValue={selectedTier}*/}
            {/*                style={styles.picker}*/}
            {/*                onValueChange={(itemValue, itemIndex) => setSelectedTier(itemValue)}*/}
            {/*            >*/}
            {/*                <Picker.Item label="Tier 1" value={1}/>*/}
            {/*                <Picker.Item label="Tier 2" value={2}/>*/}
            {/*                <Picker.Item label="Tier 3" value={3}/>*/}
            {/*                <Picker.Item label="Tier 4" value={4}/>*/}
            {/*                <Picker.Item label="Tier 5" value={5}/>*/}
            {/*            </Picker>*/}
            {/*{/* Text Input */}
            {/*            <TextInput*/}
            {/*                style={styles.messageInput}*/}
            {/*                placeholder="Type your message here..."*/}
            {/*                multiline*/}
            {/*                onChangeText={text => setMessageToSend(text)}*/}
            {/*            />*/}
            {/*{/* Send button */}
            {/*            <TouchableOpacity style={styles.button} onPress={sendMessage}>*/}
            {/*                <Text style={styles.buttonText}>Send</Text>*/}
            {/*            </TouchableOpacity>*/}
            {/*        </View>*/}
            {/*    </View>*/}
            {/*</Modal>*/}

            <AddButton onPress={() => setAddModalVisible(!isAddModalVisible)}/>

            <Modal visible={isAddModalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    {errorMessage !== '' && (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    )}
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton}
                                          onPress={() => setAddModalVisible(!isAddModalVisible)}>
                            <MaterialCommunityIcons name="close" size={20} color="#000"/>
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
                                    onPress={() => {
                                        setAddModalVisible(!isAddModalVisible)
                                        setSelectedContact(contact)
                                    }}/>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/*<Modal visible={addModal} transparent animationType="fade">*/}
            {/*    <View style={styles.addModalContainer}>*/}
            {/*        <View style={styles.addModalContent}>*/}
            {/*            <TouchableOpacity style={styles.closeButton} onPress={toggleAddModal}>*/}
            {/*                <MaterialCommunityIcons name="close" size={20} color="#000"/>*/}
            {/*            </TouchableOpacity>*/}
            {/*            <Text style={styles.modalTitle}>Add Contact</Text>*/}
            {/*            {selectedContact && (*/}
            {/*                <View style={styles.selectedContactInfo}>*/}
            {/*                    <Text>{selectedContact.name}</Text>*/}
            {/*                    <Text>{selectedContact.phoneNumbers && selectedContact.phoneNumbers.length > 0 ? formatPhoneNumber(selectedContact.phoneNumbers[0].number) : 'No Phone Number'}</Text>*/}
            {/*                </View>*/}
            {/*            )}*/}
            {/*            <Text style={styles.tierText}>Set Tier</Text>*/}
            {/*            <Picker*/}
            {/*                selectedValue={selectedTier}*/}
            {/*                style={styles.picker}*/}
            {/*                onValueChange={(itemValue, itemIndex) =>*/}
            {/*                    setSelectedTier(itemValue)*/}
            {/*                }>*/}
            {/*                <Picker.Item label="1" value={1}/>*/}
            {/*                <Picker.Item label="2" value={2}/>*/}
            {/*                <Picker.Item label="3" value={3}/>*/}
            {/*                <Picker.Item label="4" value={4}/>*/}
            {/*                <Picker.Item label="5" value={5}/>*/}
            {/*            </Picker>*/}
            {/*            <TouchableOpacity style={styles.button} onPress={addContactToNetwork}>*/}
            {/*                <Text style={styles.buttonText}>Add Contact</Text>*/}
            {/*            </TouchableOpacity>*/}
            {/*        </View>*/}
            {/*    </View>*/}
            {/*</Modal>*/}

        </View>
    )
}

function NewMessageButton({onPress}) {
    return (
        <View style={styles.msgContainer}>
            <TouchableOpacity style={styles.msgButton} onPress={onPress}>
                <MaterialCommunityIcons name="message-outline" size={30} color={COLORS.primaryColor}/>
            </TouchableOpacity>
        </View>
    )
}

function AddButton({onPress}) {
    return (
        <View style={styles.addContainer}>
            <TouchableOpacity style={styles.addButton} onPress={onPress}>
                <MaterialCommunityIcons name="plus" size={30} color="#fff"/>
            </TouchableOpacity>
        </View>
    )
}


function Contact({name, phone, onPress}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={contactStyles.container}>
                <View style={contactStyles.content}>
                    <Text style={contactStyles.name}>{name}</Text>
                    <Text style={contactStyles.phone}>{phone}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const contactStyles = StyleSheet.create({
    container: {
        width: '100%', // Take up full width
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    phone: {
        fontSize: 13,
    },
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 40,
        paddingBottom: 40,
        paddingTop: 10,
        backgroundColor: "white"
    },
    overContainer: {
        height: '100%',
        backgroundColor: 'white'
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
    addModalContainer: {
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
    messageModalContainer: {
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
        borderRadius: 5,
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
    },
    msgContainer: {
        position: 'absolute',
        bottom: 100, // Adjust as needed
        right: 30, // Adjust as needed
    },
    msgButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: {width: 0, height: 2}, // For iOS shadow
        shadowOpacity: 0.8, // For iOS shadow
    },
    addContainer: {
        position: 'absolute',
        bottom: 30, // Adjust as needed
        right: 30, // Adjust as needed
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: {width: 0, height: 2}, // For iOS shadow
        shadowOpacity: 0.8, // For iOS shadow
    },
    emptyMessage: undefined,
    emptyMessageConatiner: undefined
});