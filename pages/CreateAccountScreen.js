import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import app from '../config/firebaseConfig';
import { COLORS } from '../constants';

const CreateAccountScreen = ({ navigation }) => {
    const db = app.db;
    const auth = app.auth;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const signUp = async () => {
        setLoading(true);
        try {
            // Ensure passwords match
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;

            // Create a Firestore document for the user with First Name and Last Name
            await setDoc(doc(collection(db, 'users'), user.uid), {
                uid: user.uid,
                firstName: fname,
                lastName: lname,
                email: email
                // You can add other user-related data here
            });

            console.log('Firestore document created for user:', user.uid);
            setErrorMessage(''); // Clear error message if sign up succeeds

            // Clear form fields
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setFname('');
            setLname('');

            // Reset navigation stack to initial state (navigate to Home screen)
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            console.log(error);
            setErrorMessage("Email already in use."); // Set error message received from Firebase

            // Clear error message after 5 seconds
            setTimeout(() => {
                setErrorMessage('');
            }, 5000); // 5000 milliseconds = 5 seconds
        } finally {
            setLoading(false);
        }
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Empower2Families</Text>
                <TextInput
                    style={styles.input}
                    value={fname}
                    placeholder='First Name'
                    onChangeText={(text) => setFname(text)}
                />
                <TextInput
                    style={styles.input}
                    value={lname}
                    placeholder='Last Name'
                    onChangeText={(text) => setLname(text)}
                />
                <TextInput
                    style={styles.input}
                    value={email}
                    placeholder='Email'
                    autoCapitalize='none'
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={password}
                    placeholder='Password'
                    autoCapitalize='none'
                    onChangeText={(text) => setPassword(text)}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={confirmPassword}
                    placeholder='Confirm Password'
                    autoCapitalize='none'
                    onChangeText={(text) => setConfirmPassword(text)}
                />
                {errorMessage !== '' && (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                )}
                {loading ? (
                    <ActivityIndicator size='large' color={COLORS.primaryColor} />
                ) : (
                    <>
                        <Pressable style={styles.createAccountButton} onPress={signUp}>
                            <Text style={styles.createAccountButtonText}>Create Account</Text>
                        </Pressable>
                        <Pressable style={styles.backToLogin} onPress={() => { navigation.navigate('Login') }}>
                            <Text style={styles.backToLoginText}>Back to Login</Text>
                        </Pressable>
                    </>
                )}
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // Set your desired background color
    },
    formContainer: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#ffffff', // Set your desired form background color
        elevation: 5, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5
    },
    createAccountButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 5,
        backgroundColor: COLORS.primaryColor,
        marginBottom: 10
    },
    createAccountButtonText: {
        color: COLORS.lightText,
        fontWeight: 'bold'
    },
    backToLogin: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.primaryColor,
        borderWidth: 3,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 5,
        backgroundColor: COLORS.lightText,
    },
    backToLoginText: {
        fontWeight: 'bold',
        color: COLORS.primaryColor
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
        borderWidth: 2,
        borderColor: 'red',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#ffe8e9'
    },
});

export default CreateAccountScreen;
