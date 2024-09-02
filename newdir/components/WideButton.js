import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

const WideButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={wideButtonStyles.button} onPress={onPress}>
      <Text style={wideButtonStyles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const wideButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primaryColor,
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
	justifyContent: 'flex-end',
	height: 85,
  elevation: 5,
	shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
	  fontWeight: 'bold',
  },
});

export default WideButton;
