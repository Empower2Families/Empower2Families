import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

const SmallButton = ({ text, onPress }) => {
  const containerWidth = Dimensions.get('window').width;
  const buttonWidth = containerWidth / 2.8;

  return (
    <TouchableOpacity style={[smallButtonStyles.button, { width: buttonWidth }]} onPress={onPress}>
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
    height: 85,
    justifyContent: 'flex-end',
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

export default SmallButton;
