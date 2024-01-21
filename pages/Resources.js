// Resources.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Resources = ({navigation}) => {

  const navigateToHome = () => {
    navigation.navigate("Home")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resources Page</Text>
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
    backgroundColor: 'white'
  },
  title: {
    fontSize: 20,
    marginBottom: 50
  },
});

export default Resources;
