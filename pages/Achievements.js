// Achievements.js

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Achievements = ({navigation}) => {

  const navigateToHome = () => {
    navigation.navigate("Home")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements Page</Text>
      <TouchableOpacity onPress={navigateToHome}>
        <Text>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 50
  },
});

export default Achievements;
