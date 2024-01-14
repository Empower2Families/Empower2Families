// Goals.js

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Goals = ({navigation}) => {

  const navigateToHome = () => {
    navigation.navigate("Home")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goals Page</Text>
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

export default Goals;
