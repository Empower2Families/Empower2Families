import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

const Tile = ({ text, onPress }) => {
  const containerWidth = Dimensions.get('window').width;
  const buttonWidth = containerWidth / 4;

  return (
    <TouchableOpacity style={[smallButtonStyles.button, { width: buttonWidth }]}>
      <Text style={smallButtonStyles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const smallButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.lightModeBG,
    padding: 15,
    borderRadius: 5,
    marginVertical: 14,
    height: 85,
    justifyContent: 'flex-start',
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
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Tile;
