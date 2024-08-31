import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants';

const ListItem = ({text, id, onDelete, onEdit}) => {
  const openMenu = () => {
    console.log('menu open');
  }

  return (
    <View style={listItemStyles.container}>
      <Text style={listItemStyles.buttonText}>{text}</Text>
      <Menu>
      <MenuTrigger><MaterialCommunityIcons name="dots-vertical" size={30} color="grey" /></MenuTrigger>
      <MenuOptions style={listItemStyles.menu}>
        <MenuOption onSelect={() => onEdit(id)} text='Edit' />
        <MenuOption onSelect={() => onDelete(id)} >
          <Text style={{color: 'red'}}>Delete</Text>
        </MenuOption>
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
  buttonText: {
    fontSize: 15,
	  fontWeight: 'bold',
    width: '60%'
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
  }
});

export default ListItem;
