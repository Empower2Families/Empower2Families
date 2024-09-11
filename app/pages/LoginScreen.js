
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import app from '../config/firebaseConfig';
import { COLORS } from '../constants';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

	const auth = app.auth;


  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error) {
      console.log(error);
      setErrorMessage('Invalid email or password. Please try again.')
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
        {errorMessage !== '' && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
        {loading ? (
          <ActivityIndicator size='large' color='#0000ff' />
        ) : (
          <>
            <Pressable onPress={signIn} style={styles.loginButton}>
				<Text style={styles.loginButtonText}>Sign In</Text>
			</Pressable>
			<Pressable style={styles.createAccountButton}  onPress={() => {navigation.navigate('CreateAccount')}}>
				<Text style={styles.createAccountButtonText}>Create Account</Text>
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
    backgroundColor: "white", // Set your desired background color
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
    textAlign: 'center',
    fontStyle: 'italic'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
	borderRadius: 5
  },
  loginButton: {
	alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius:5,
    backgroundColor: COLORS.primaryColor,
	
	marginBottom: 10
  },
  loginButtonText: {
	color: COLORS.lightText,
	fontWeight: 'bold'
  },
  createAccountButton: {
	alignItems: 'center',
    justifyContent: 'center',
	borderColor: COLORS.primaryColor,
	borderWidth: 3,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius:5,
    backgroundColor: COLORS.lightText,
  },
  createAccountButtonText: {
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

export default LoginScreen;
