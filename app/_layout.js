import { View, Image, StyleSheet, Pressable } from 'react-native'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons } from '@expo/vector-icons'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'

function LogoTitle() {
  return (
    // TODO title icon
    <></>// <Image style={styles.image} source={require("@/assets/images/icon.png")} />
  )
}

function SettingsButton() {
  return (
    <Pressable>
      <MaterialIcons name="settings" style={{ padding: 15 }} size={30} />
    </Pressable>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const colorTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  return (
    <ThemeProvider value={colorTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{
        headerLeft: () => <LogoTitle />,
        headerRight: () => <SettingsButton />,
        headerTitleStyle: styles.header
      }}>
        {/* Content for each page will be placed here */}
        <Stack.Screen name="index" options={{ title: "Home" }} />
      </Stack>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
    paddingLeft: 15,
    alignSelf: 'flex-end'
  },
  header: {
    // TODO center header text
    fontSize: 18,
    fontWeight: 'bold',
  }
});
