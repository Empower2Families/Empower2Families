import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import Copyright from './components/Copyright';
import Navbar from './components/Navbar';
import RecentAchievements from './components/RecentAchievements';
import Reflections from './components/Reflections';
import User from './components/User';
import WideButton from './components/WideButton';
import { COLORS } from './constants';

export default function App() {

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
          <Navbar/>
          <User />
          <WideButton text="My Network"/>
          <Reflections />
          <RecentAchievements />
          <WideButton text="Resources" />
          <Copyright />
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.lightModeBG,
    padding: 40
  },
  scrollContainer: {
    flexGrow: 1,
    width: 'auto'
  },
});
