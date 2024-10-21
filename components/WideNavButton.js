import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {COLORS} from '../constants/Colors';
import {Link} from 'expo-router';

export default function WideNavButton({text, navTo}) {
  return (
    <Link href={navTo} asChild>
      <Pressable style={wideButtonStyles.button}>
        <Text style={wideButtonStyles.buttonText}>{text}</Text>
      </Pressable>
    </Link>
  )
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
})
