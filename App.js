import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import app from './config/firebaseConfig';
import Achievements from './pages/Achievements';
import CreateAccountScreen from './pages/CreateAccountScreen';
import Goals from './pages/Goals';
import Home from './pages/Home';
import LoginScreen from './pages/LoginScreen';
import Stressors from './pages/Stressors';
import Supports from './pages/Supports';

const Stack = createNativeStackNavigator();

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = app.auth.onAuthStateChanged((user) => {
      // Check if the user is logged in or not
      setUserLoggedIn(!!user);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array to run the effect only once on component mount

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: () => (userLoggedIn ? <Navbar /> : null), // Use Navbar as the custom header component
        }}
      >
        {userLoggedIn ? (
          // User is logged in, show Home component
          <Stack.Screen name="Home" component={Home} />
        ) : (
          // User is not logged in, show LoginScreen
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
        <Stack.Screen name="Goals" component={Goals} />
        <Stack.Screen name="Achievements" component={Achievements} />
        <Stack.Screen name="Stressors" component={Stressors} />
        <Stack.Screen name="Supports" component={Supports} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
