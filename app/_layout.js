import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Text, View, Image, StyleSheet, Pressable, useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons';
import 'react-native-reanimated'
import { StatusBar } from 'expo-status-bar';

function LogoTitle(props) {
  return (
    <>
      <Image style={styles.icon} source={require("@/assets/images/icon.png")} />
      <Text style={styles.header}>{props.children}</Text>
    </>
  )
}

function SettingsButton() {
  return (
    <Pressable>
      <MaterialIcons name="settings" color="black" size={30}/>
    </Pressable>
  )
}

export default function RootLayout() {
  const darkmode = useColorScheme()
  const colorTheme = darkmode ? DarkTheme : DefaultTheme
  
  return (
    <ThemeProvider value={colorTheme}>
      <StatusBar style="dark" />
      <Stack screenOptions={{
        headerTitle: props => <LogoTitle {...props} />,
        headerRight: () => <SettingsButton />,
      }}> 
        {/* Content for each page will be placed here */}
        <Stack.Screen name="index" options={{title: "Home"}} />
      </Stack>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30
  },
  header: {
    padding: 8,
    fontSize: 18,
    fontWeight: "bold" 
  }
});
