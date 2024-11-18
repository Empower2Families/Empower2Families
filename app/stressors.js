// Supports.js

import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger} from 'react-native-popup-menu';
import MaterialCommunityIcons from '@expo/vector-icons';
import AddButton from '@/components/AddButton';
import {COLORS} from '@/constants/Colors';
import {useSQLiteContext} from "expo-sqlite";

export default function Supports() {
    const db = useSQLiteContext();
    const [isModalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false); // New state for edit modal
    const [stressorsText, setStressorText] = useState('');
    const [editedStressorsText, setEditedStressorsText] = useState(''); // New state for edited support text
    const [editingStressorsId, setEditingStressorsId] = useState(null); // New state for tracking the support being edited
    const [stressors, setStressors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');


    const emptyMessage = "You don’t have any stressors added yet, click the blue plus sign to add one!";

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const addStressor = async () => {
        try {
            const userRef = doc(db, 'stressors', user.uid);

            // Get the current supports array from the document
            const userDoc = await getDoc(userRef);
            const currentStressors = userDoc.data()?.stressors || [];

            // Add the new support to the array
            if (stressorsText.length > 0) {
                currentStressors.push(stressorsText);
                toggleModal(); // Close the modal after adding support
                // Refresh the supports array
                getStressors();
            } else {
                setErrorMessage('Stressor left blank.');
                setTimeout(() => {
                    setErrorMessage('');
                }, 5000);
            }
            setStressorText('');


            // Update the document with the modified array
            await setDoc(userRef, {
                stressors: currentStressors,
            });


        } catch (error) {
            console.log(error);
        }


    };

    const getStressors = async () => {
        setIsLoading(true);
        if (user) {
            const stressorsRef = doc(db, 'stressors', user.uid);

            try {
                const stressorsDoc = await getDoc(stressorsRef);
                const stressorsData = stressorsDoc.data()?.stressors || [];

                setStressors(stressorsData.map((stressor, index) => ({id: index.toString(), text: stressor})));
            } catch (error) {
                console.error('Error fetching supports document:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const deleteStressor = async (id) => {
        try {
            const userRef = doc(db, 'stressors', user.uid);
            const userDoc = await getDoc(userRef);
            const currentStressors = userDoc.data()?.stressors || [];

            // Remove the support with the specified id
            const updatedStressors = currentStressors.filter((_, index) => index.toString() !== id);

            // Update the document with the modified array
            await setDoc(userRef, {
                stressors: updatedStressors,
            });

            // Refresh the supports array
            getStressors();
        } catch (error) {
            console.log(error);
        }
    };

    const editStressor = async (id) => {
        try {
            const userRef = doc(db, 'stressors', user.uid);
            const userDoc = await getDoc(userRef);
            const currentStressors = userDoc.data()?.stressors || [];

            const editedStressorsText = await openEditModal(id, currentStressors[id]);

            if (editedStressorsText !== null) {
                // Update the support with the specified id
                currentStressors[id] = editedStressorsText;

                // Refresh the supports array
                getStressors();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const saveEditedStressor = async () => {
        try {
            if (editedStressorsText !== undefined && editedStressorsText.trim() !== '') {
                const userRef = doc(db, 'stressors', user.uid);
                const userDoc = await getDoc(userRef);
                const currentStressors = userDoc.data()?.stressors || [];

                // Modify the specific element in the array
                currentStressors[editingStressorsId] = editedStressorsText;
                console.log(editedStressorsText);

                // Update the document with the modified array
                await setDoc(userRef, {
                    stressors: currentStressors,
                });

                // Close the edit modal
                closeEditModal();

                // Refresh the supports array
                getStressors();
            } else {
                console.error('Invalid editedStressorsText:', editedStressorsText);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const openEditModal = (id, text) => {
        setEditedStressorsText(text);
        setEditingStressorsId(id);
        setEditModalVisible(true);
    };

    const closeEditModal = () => {
        setEditedStressorsText('');
        setEditingStressorsId(null);
        setEditModalVisible(false);
    };

    useEffect(() => {
        getStressors();
    }, []);

    return (
        <MenuProvider>
            <View style={styles.overCon}>
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Stressors</Text>
                        {isLoading ? (
                            <ActivityIndicator size="large" color={COLORS.primaryColor}/>
                        ) : stressors.length === 0 ? (
                            <View style={styles.emptyMessageConatiner}>
                                <Text style={styles.emptyMessage}>{emptyMessage}</Text>
                            </View>
                        ) : (
                            stressors.map((stressors) => (
                                <ListItem key={stressors.id} text={stressors.text} onDelete={deleteStressor}
                                          id={stressors.id} onEdit={editStressor}/>
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
                                <MaterialCommunityIcons name="close" size={20} color="#000"/>
                            </TouchableOpacity>

                            <Text style={styles.modalTitle}>Add Stressor</Text>
                            <Text style={styles.info}>A stressor can be ...!</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Enter your stressor here ..."
                                onChangeText={(text) => setStressorText(text)}
                            />
                            <TouchableOpacity style={styles.button} onPress={addStressor}>
                                <Text style={styles.buttonText}>Add Stressor</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal visible={editModalVisible} transparent animationType="fade">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={closeEditModal}>
                                <MaterialCommunityIcons name="close" size={20} color="#000"/>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Edit Stressor</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Enter your edited stressor here ..."
                                onChangeText={(text) => setEditedStressorsText(text)}
                                value={editedStressorsText}
                            />
                            <TouchableOpacity style={styles.button} onPress={saveEditedStressor}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </MenuProvider>
    );
};

function ListItem({text, id, onDelete, onEdit}) {
    const openMenu = () => {
        console.log('menu open');
    }

    return (
        <View style={listItemStyles.container}>
            <Text style={listItemStyles.buttonText}>{text}</Text>
            <Menu>
                <MenuTrigger><MaterialCommunityIcons name="dots-vertical" size={30} color="grey"/></MenuTrigger>
                <MenuOptions style={listItemStyles.menu}>
                    <MenuOption onSelect={() => onEdit(id)} text='Edit'/>
                    <MenuOption onSelect={() => onDelete(id)}>
                        <Text style={{color: 'red'}}>Delete</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        </View>
    );
}

const listItemStyles = StyleSheet.create({
    container: {
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
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        width: '60%'
    },
    menu: {
        position: 'absolute',
        backgroundColor: 'white',
        right: 0,
        top: -150,
        padding: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    }
});

const styles = StyleSheet.create({
    overCon: {
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
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 12
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
