// Supports.js

import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import AddButton from '@/components/AddButton';
import ListItem from '@/components/ListItem';
import {COLORS} from '@/constants/Colors';
import {useSQLiteContext} from "expo-sqlite";

export default function Stressors() {
    const db = useSQLiteContext();
    const [isModalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false); // New state for edit modal
    const [stressorText, setStressorText] = useState('');
    const [editedStressorsText, setEditedStressorsText] = useState(''); // New state for edited support text
    const [editingStressorId, setEditingStressorsId] = useState(null); // New state for tracking the support being edited
    const [stressors, setStressors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');


    const emptyMessage = "You don’t have any stressors added yet, click the blue plus sign to add one!";

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const addStressor = async () => {
        try {
            if (stressorText.length > 0) {
                await db.runAsync('INSERT INTO stressors (text, date) VALUES (?, ?);', stressorText, Date.now())
                toggleModal(); // Close the modal after adding

                getStressors();
            } else {
                setErrorMessage('Stressor left blank');
                setTimeout(() => {
                    setErrorMessage('');
                }, 5000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setStressorText('')
            setIsLoading(false)
        }
    };

    const getStressors = async () => {
        setIsLoading(true);

        try {
            db.getAllAsync("SELECT * FROM stressors;").then(r => {
                setStressors(r.map((s, index) => ({
                    id: s.id,
                    text: s.text,
                    // Assuming you want to display the accomplishment timestamp as well
                    timestamp: s.date,
                })));
            })
        } catch (error) {
            console.error('Error fetching stressors document:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteStressor = async (id) => {
        try {
            await db.runAsync("DELETE FROM stressors WHERE id = ?", id)
            getStressors();
        } catch (error) {
            console.log(error);
        }
    };

    const editStressor = async (id) => {
        try {
            db.getFirstAsync("SELECT * FROM stressors WHERE id = ?", id).then(async (r) => {
                await openEditModal(id, r.text);
            }, reason => console.warn(reason))
        } catch (error) {
            console.error(error);
        }
    };

    const saveEditedStressor = async () => {
        try {
            if (editedStressorsText !== undefined && editedStressorsText.trim() !== '') {
                // Update the stressor with the specified id
                await db.runAsync("UPDATE stressors SET text = ? WHERE id = ?;", editedStressorsText, editingStressorId)

                // Close the edit modal
                closeEditModal();

                // Refresh the stressors array
                getStressors()
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
