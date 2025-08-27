import React, {useEffect, useState} from 'react'
import {ScrollView, StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native'
import * as Contacts from 'expo-contacts'
import {Picker} from '@react-native-picker/picker'
import * as Sms from 'expo-sms'
import {useSQLiteContext} from 'expo-sqlite'

import {COLORS} from '@/constants/Colors'
import {MenuProvider} from 'react-native-popup-menu';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {addContact} from "@/data/User";
import {delContact} from "@/data/User";

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications


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
    const [isContactModalVisible, setContactModalVisible] = useState(false);
    const [isMessageModalVisible, setMessageModalVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const [network, setNetwork] = useState([]);
    const [selectedTier, setSelectedTier] = useState(1);
    const [selectedContact, setSelectedContact] = useState(null);

    const syncNetwork = async () => {
        const rows = db.getAllAsync("SELECT * FROM contacts")
        setNetwork((await rows).map((row, index) => ({
            id: index.toString(),
            name: row?.name,
            phone: row?.phone,
            level: row?.level
        })))
    }

    const addContactToNetwork = async () => {
        let phone = selectedContact.phoneNumbers.length > 0 ? selectedContact.phoneNumbers[0].number : 'No Phone Number'
        await addContact(db, selectedContact.name, phone, selectedTier)
        setSelectedContact(null);
        setSelectedTier(1);
        setAddModalVisible(false);
        await syncNetwork();
    };

    const deleteContact = async (phone) => {
        try {
            await delContact(db, selectedContact.name, phone, selectedTier)
            await syncNetwork();
        } catch (error) {
            console.log(error);
        }
    };

    const getContacts = async () => {
        setIsLoading(true);
        try {
            let phone = selectedContact.phoneNumbers.length > 0 ? selectedContact.phoneNumbers[0].number : 'No Phone Number'
            await addContact(db, selectedContact.name, phone, selectedTier)
            setSelectedContact(null);
            setSelectedTier(1);
            setAddModalVisible(false);
            await syncNetwork();
        } catch (error) {
            console.error('Error fetching stressors document:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            const {status} = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const {data} = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.FirstName, Contacts.Fields.PhoneNumbers]
                });

                const formattedContacts = data.map(contact => ({
                    ...contact,
                    phoneNumbers: contact.phoneNumbers ? contact.phoneNumbers.map(phone => ({
                        ...phone,
                        number: formatPhoneNumber(phone.number.replace(/^\+?1?/, '')) // Remove +1 country code and leading 1
                    })) : []
                }));

                setContacts(formattedContacts);
                setFilteredContacts(formattedContacts);
            }
        })()
    }, []);

    useEffect(() => {
        const filtered = contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredContacts(filtered);
        syncNetwork();
    }, [searchQuery]);

return (
    <View style={styles.overContainer}>
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>My Network</Text>
                {network.length === 0 ? (
                    <View style={styles.emptyMessageContainer}>
                        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
                    </View>
                ) : (
                    Array.from({ length: 4 }, (_, index) => {
                        const levelContacts = network.filter(contact => contact.level === index + 1);
                        return levelContacts.length > 0 ? (
                            <View key={index}>
                                <Text style={styles.levelHeader}>
                                    {index === 0 ? 'Immediate' : index === 1 ? 'Natural' : index === 2 ? 'Interest' : 'Community'}
                                </Text>
                                {levelContacts.map(contact => (
                                    <View key={contact.id} style={[styles.menuContainer, styles.contactDisplay]}>
                                        <MenuProvider>
                                            <Menu style={{ display: 'flex', flexDirection: 'row' }}>
                                                <Text style={{ width: 225 }}>
                                                    {contact.name} {contact.phone}
                                                </Text>
                                                <MenuOption onSelect={() => {
                                                    setSelectedContact(contact);
                                                    deleteContact(contact.phone);
                                                }}>
                                                    <Text style={{ color: 'gray', width: 50, top: -5 }}>
                                                        Delete
                                                    </Text>
                                                </MenuOption>
                                            </Menu>
                                        </MenuProvider>
                                    </View>
                                ))}
                            </View>
                        ) : null;
                    })
                )}
            </View>
        </ScrollView>

        <AddButton onPress={() => setContactModalVisible(!isContactModalVisible)} />

        <Modal visible={isContactModalVisible} transparent animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setContactModalVisible(!isContactModalVisible)}
                    >
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
                                phone={contact.phoneNumbers && contact.phoneNumbers.length > 0
                                    ? formatPhoneNumber(contact.phoneNumbers[0].number)
                                    : 'No Phone Number'}
                                onPress={() => {
                                    setAddModalVisible(!isAddModalVisible);
                                    setSelectedContact(contact);
                                }}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>

        <Modal visible={isAddModalVisible} transparent animationType="fade">
            <View style={styles.addModalContainer}>
                <View style={styles.addModalContent}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setAddModalVisible(!isAddModalVisible)}
                    >
                        <MaterialCommunityIcons name="close" size={20} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Add Contact</Text>
                    {selectedContact ? (
                        <View style={styles.selectedContactInfo}>
                            <Text>{selectedContact.name}</Text>
                            <Text style={styles.rightText}>
                                {selectedContact.phoneNumbers && selectedContact.phoneNumbers.length > 0
                                    ? formatPhoneNumber(selectedContact.phoneNumbers[0].number)
                                    : 'No Phone Number'}
                            </Text>
                        </View>
                    ) : null}
                    <Text style={styles.tierText}>Set Tier</Text>
                    <Picker
                        selectedValue={selectedTier}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedTier(itemValue)}
                    >
                        <Picker.Item label="Immediate" value={1} />
                        <Picker.Item label="Natural" value={2} />
                        <Picker.Item label="Interest" value={3} />
                        <Picker.Item label="Community" value={4} />
                    </Picker>
                    <TouchableOpacity style={styles.button} onPress={addContactToNetwork}>
                        <Text style={styles.buttonText}>Add Contact</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>
);
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
        backgroundColor: "white",
        width: '100%',
    },
    overContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white'
    },
    scrollContainer: {
        flexGrow: 1,
        width: '98%',
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
        padding: 60,
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
        fontSize: 20,
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
        marginTop: -60,
        fontSize: 20,
        fontWeight: 'bold',
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
    rightText: {
        textAlign: 'end',
        display: 'block',
        height: 100,
    },
    menu: {
            position: 'absolute',
            backgroundColor: 'white',
            right: -20,
            top: -80,
            padding: 10,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: {
                width: 2,
                height: 4,
            },
            shadowOpacity: 0.2,
            shadowRadius: 10,
        },
    menuContainer: {
            width: '100%',
            backgroundColor: 'white',
            borderRadius: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            marginVertical: 10,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: {
                width: 2,
                height: 4,
            },
            shadowOpacity: 0.2,
            shadowRadius: 10,
        },
    emptyMessage: undefined,
    emptyMessageConatiner: undefined
});