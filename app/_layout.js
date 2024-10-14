import { Stack } from 'expo-router'
import 'react-native-reanimated'

import Navbar from '../components/Navbar';

// Structure component, content placed here will appear on all pages
export default function RootLayout() {
  return (
    <Stack screenOptions={({ navigation }) => ({
      header: () => <Navbar navigation={navigation} />,
    })}>
      {/* Content for each page will be placed here */}
      <Stack.Screen name="index" />
      <Stack.Screen name="resources" />
    </Stack>
  )
}

