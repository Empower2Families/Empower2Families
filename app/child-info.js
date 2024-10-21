import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TextInput,
    Image, Pressable
} from 'react-native';
//import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import * as ImagePicker from 'expo-image-picker';

import {COLORS} from '../constants/Colors';
import {useSQLiteContext} from "expo-sqlite";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import EditButton from '../components/EditButton'


export default function ChildInfo() {
    // Get DB from current context
    const db = useSQLiteContext()

    //    useEffect(function () {
    //        async function effect() {
    //            const firstRow = await db.getFirstAsync("SELECT * FROM todos")
    //            console.log(firstRow.id, firstRow.value, firstRow.intValue)
    //        }
    //
    //        effect().then(r => {
    //        })
    //    })

    // Get child info shallow, don't follow any links

    // Whenever the db source changes, update the child's image

    // Launch image picker for selecting child image

    // Helper function to write to persitent db

    // TODO populate from DB
    let hasChildInfo = true
    let [name, setName] = useState("test")
    let [bio, setBio] = useState("test")
    let [birthday, setBirthday] = useState("test")
    let [selectedImage, selectImage] = useState(null);
    let [isModalVisible, setModalVisible] = useState(false)
    let pickImage = () => {
    }
    let handleAddChildInfo = () => {
    }
    let handleSubmitChildInfo = () => {
    }

    return (
        <View style={{flex: 1, backgroundColor: "white"}}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>Child Info</Text>
                    {hasChildInfo ? (
                        <View style={styles.childInfo}>
                            {/* Child image/image upload */}
                            <Pressable style={styles.circle} onPress={pickImage}>
                                {selectedImage ? (
                                    <Image source={{uri: selectedImage}} style={styles.circleImage} resizeMode="cover"/>
                                ) : (
                                    <Text style={styles.circleText}>Upload Image</Text>
                                )}
                            </Pressable>

                            {/* Display child info */}
                            <Text style={styles.name}>
                                <Text style={styles.nameTitle}>Name: </Text>
                                {name}
                            </Text>

                            <Text style={styles.birthday}>
                                <Text style={styles.birthdayTitle}>Birthday: </Text>
                                {birthday}
                            </Text>

                            <Text style={styles.bio}>
                                <Text style={styles.bioTitle}>Bio: </Text>
                                {bio}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.emptyMessageContainer}>
                            <Text style={styles.noChildInfoText}>
                                You haven’t added your child’s info,{' '}
                                <Pressable onPress={handleAddChildInfo} style={styles.noChildInfoContainer}>
                                    <Text style={styles.addInfo}>click here to add.</Text>
                                </Pressable>
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            <EditButton onPress={() => setModalVisible(!isModalVisible)}/>
            <Modal visible={isModalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Pressable style={styles.closeButton} onPress={() => setModalVisible(!isModalVisible)}>
                            <MaterialCommunityIcons name="close" size={20} color="#000"/>
                        </Pressable>
                        <Text style={styles.modalTitle}>Add Child Info</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Name"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Birthday"
                            value={birthday}
                            onChangeText={(text) => setBirthday(text)}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Bio"
                            value={bio}
                            onChangeText={(text) => setBio(text)}
                        />
                        <Pressable style={styles.button} onPress={handleSubmitChildInfo}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
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
    buttonText: {
        color: COLORS.lightText,
        fontWeight: 'bold'
    },
    scrollContainer: {
        flexGrow: 1,
    },
    circle: {
        width: 225,
        height: 225,
        borderRadius: 150,
        backgroundColor: '#d3d3d3',
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 20,
        overflow: 'hidden', // Clip any overflow content
    },
    circleImage: {
        width: '100%',
        height: '100%',
        borderRadius: 150, // Same as the container's borderRadius
    },
    circleText: {
        width: "100%",
        height: "100%",
        textAlign: "center",
        textAlignVertical: "center",
    },
    childInfo: {
        alignItems: 'center',
    },
    bio: {
        fontSize: 20,
        textAlign: 'center',
        width: 250
    },
    bioTitle: {
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        marginBottom: 15,
    },
    nameTitle: {
        fontWeight: 'bold',
    },
    birthday: {
        fontSize: 24,
        marginBottom: 15,
    },
    birthdayTitle: {
        fontWeight: 'bold',
    },
    noChildInfoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 18,
    },
    noChildInfoText: {
        fontSize: 18,
        textAlign: 'center',
    },
    addInfo: {
        color: COLORS.primaryColor,
        fontSize: 18,
        width: 175,
    },
    emptyMessageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '60%', // Adjust as needed
    },
});
