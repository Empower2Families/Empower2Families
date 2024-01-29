import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants';

const Goal = ({text, met , id, onDelete, onEdit, onMet}) => {
  const [isMet, setIsMet] = useState(false);

  const openMenu = () => {
    console.log('menu open');
  }




  return (
    <View style={listItemStyles.container}>
      <View style={listItemStyles.goalItems}>
      <Text style={listItemStyles.goalText}>{text}</Text>
      {met == 'T' ? <MaterialCommunityIcons name="check-circle-outline" size={30} color="#90EE90" /> : <></>}
    </View>
      <Menu>
      <MenuTrigger><MaterialCommunityIcons name="dots-vertical" size={30} color="grey" /></MenuTrigger>
      <MenuOptions style={listItemStyles.menu}>
        <MenuOption onSelect={() => onEdit(id)} text='Edit' />
        <MenuOption onSelect={() => onDelete(id)} >
          <Text style={{color: 'red'}}>Delete</Text>
        </MenuOption>
        <MenuOption onSelect={() => onMet(id)}><Text style={{color: 'green'}}>Set to Done</Text></MenuOption>
      </MenuOptions>
    </Menu>
    </View>
  );
}

const listItemStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
	  justifyContent: 'space-between',
    alignItems: 'center',
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
  goalText: {
    fontSize: 15,
	  fontWeight: 'bold',
  },
  menu:{
    position: 'absolute',
    backgroundColor: 'white',
    right: 0,
    top: -150,
    padding: 10,
    elevation: 5,
	  shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  goalItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignItems: 'center'
  }
});

export default Goal;
