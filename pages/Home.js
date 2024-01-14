// Home.js
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Copyright from '../components/Copyright';
import RecentAchievements from '../components/RecentAchievements';
import Reflections from '../components/Reflections';
import User from '../components/User';
import WideButton from '../components/WideButton';
import app from '../config/firebaseConfig';
import { COLORS } from '../constants';

export default function Home({navigation}) {
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <User />
        <WideButton text="My Network" />
        <Reflections navigation={navigation}/>
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
    paddingHorizontal: 40,
	paddingBottom: 40,
	paddingTop: 10
  },
  scrollContainer: {
    flexGrow: 1,
    width: 'auto',
  },
});
