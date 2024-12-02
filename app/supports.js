// Supports.js

import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import AddButton from '@/components/AddButton';
import ListItem from '@/components/ListItem';
import {COLORS} from '@/constants/Colors';
import {useSQLiteContext} from "expo-sqlite";

const Supports = () => {
    const db = useSQLiteContext();
    const [isModalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false); // New state for edit modal
    const [supportText, setSupportText] = useState('');
    const [editedSupportText, setEditedSupportText] = useState(''); // New state for edited support text
    const [editingSupportId, setEditingSupportId] = useState(null); // New state for tracking the support being edited
    const [supports, setSupports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');


    const emptyMessage = "You don’t have any supports added yet, click the blue plus sign to add one!";

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const addSupport = async () => {
        try {
            if (supportText.length > 0) {
                await db.runAsync('INSERT INTO supports (text, date) VALUES (?, ?);', supportText, Date.now())
                toggleModal(); // Close the modal after adding

                getSupports();
            } else {
                setErrorMessage('Stressor left blank');
                setTimeout(() => {
                    setErrorMessage('');
                }, 5000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSupportText('')
            setIsLoading(false)
        }
    };

    const getSupports = async () => {
        setIsLoading(true);

        try {
            db.getAllAsync("SELECT * FROM supports;").then(r => {
                setSupports(r.map((s, index) => ({
                    id: s.id,
                    text: s.text,
                    // Assuming you want to display the accomplishment timestamp as well
                    timestamp: s.date,
                })));
            })
        } catch (error) {
            console.error('Error fetching supports document:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteSupport = async (id) => {
        try {
            await db.runAsync("DELETE FROM supports WHERE id = ?", id)
            getSupports();
        } catch (error) {
            console.log(error);
        }
    };

    const editSupport = async (id) => {
        try {
            db.getFirstAsync("SELECT * FROM supports WHERE id = ?", id).then(async (r) => {
                await openEditModal(id, r.text);
            }, reason => console.warn(reason))
        } catch (error) {
            console.error(error);
        }
    };


    const saveEditedSupport = async () => {
        try {
            if (editedSupportText !== undefined && editedSupportText.trim() !== '') {
                // Update the stressor with the specified id
                await db.runAsync("UPDATE supports SET text = ? WHERE id = ?;", editedSupportText, editingSupportId)

                // Close the edit modal
                closeEditModal();

                // Refresh the stressors array
                getSupports()
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
                            <ActivityIndicator size="large" color={COLORS.primaryColor}/>
                        ) : supports.length === 0 ? (
                            <View style={styles.emptyMessageConatiner}>
                                <Text style={styles.emptyMessage}>{emptyMessage}</Text>
                            </View>
                        ) : (
                            supports.map((support) => (
                                <ListItem key={support.id} text={support.text} onDelete={deleteSupport} id={support.id}
                                          onEdit={editSupport}/>
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

                            <Text style={styles.modalTitle}>Add Support</Text>
                            <Text style={styles.info}>A support can be things that are goind good, or things that make
                                you stronger/better!</Text>
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
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={closeEditModal}>
                                <MaterialCommunityIcons name="close" size={20} color="#000"/>
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

export default Supports;