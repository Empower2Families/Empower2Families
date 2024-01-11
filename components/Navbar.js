import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Navbar = () => (
	<View style={navStyles.navbarContainer}>
		<Text style={navStyles.logo}>E2F</Text>
		<MaterialCommunityIcons name="menu" size={30} color="#000" />
	</View>
);

const navStyles = StyleSheet.create({
	navbarContainer:
	{
		flexDirection: "row",
		justifyContent: "space-between",
		paddingTop: 20
	},
	logo:
	{
	  fontSize: 24,
	  fontStyle: 'italic',
	  fontWeight: 800
	}
  });

export default Navbar;