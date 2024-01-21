import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import app from './config/firebaseConfig';
import Achievements from './pages/Achievements';
import ChildInfo from './pages/ChildInfo';
import CreateAccountScreen from './pages/CreateAccountScreen';
import Goals from './pages/Goals';
import Home from './pages/Home';
import LoginScreen from './pages/LoginScreen';
import Network from './pages/Network';
import Resources from './pages/Resources';
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
        screenOptions={({ navigation }) => ({
          header: () => (userLoggedIn ? <Navbar navigation={navigation} /> : null),
        })}
      >
        {userLoggedIn ? (
          // User is logged in, show Home component
          <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Goals" component={Goals} />
          <Stack.Screen name="Achievements" component={Achievements} />
          <Stack.Screen name="Stressors" component={Stressors} />
          <Stack.Screen name="Supports" component={Supports} />
          <Stack.Screen name="ChildInfo" component={ChildInfo} />
          <Stack.Screen name="Network" component={Network} />
          <Stack.Screen name="Resources" component={Resources} />
        </>
        ) : (
          // User is not logged in, show LoginScreen
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
