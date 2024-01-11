import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

const SmallButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={smallButtonStyles.button} onPress={onPress}>
      <Text style={smallButtonStyles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const smallButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primaryColor,
    padding: 15,
    borderRadius: 5,
    marginVertical: 14,
	width: 150,
	height: 75,
	justifyContent: 'flex-end',
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
	fontWeight: 800,
    fontFamily: 'Inter',
  },
});

export default SmallButton;
