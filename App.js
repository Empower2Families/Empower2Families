import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Navbar from './components/Navbar';
import Reflections from './components/Reflections';
import User from './components/User';
import WideButton from './components/WideButton';
import { COLORS } from './constants';

export default function App() {

  return (
    <View style={styles.container}>
      <Navbar/>
      <User />
      <WideButton text="My Network"/>
      <Reflections />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.lightModeBG,
    padding: 50
  },
});
