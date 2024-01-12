import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Copyright from './components/Copyright';
import Navbar from './components/Navbar';
import RecentAchievements from './components/RecentAchievements';
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
      <RecentAchievements />
      <Copyright />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.lightModeBG,
    padding: 40
  },
});
