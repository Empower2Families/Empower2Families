import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

const ListItem = ({ text}) => {
  return (
    <TouchableOpacity style={listItemStyles.button}>
      <Text style={listItemStyles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const listItemStyles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderRadius: 5,
	justifyContent: 'center',
	padding: 20,
	marginVertical: 10,
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

export default ListItem;
