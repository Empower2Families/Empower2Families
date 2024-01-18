import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from "../constants";

// Component that contains the 'E2F' logo and Hamburger menu
const Navbar = ({navigation}) => {
	const navigateToHome = () => {
		navigation.navigate("Home")
	  }


	return(
	<View style={navStyles.navbarContainer}>
		<Pressable onPress={navigateToHome}>
			<Text style={navStyles.logo}>E2F</Text>
		</Pressable>
		<MaterialCommunityIcons name="menu" size={30} color="#000" />
	</View>
	);
};

const navStyles = StyleSheet.create({
	navbarContainer:
	{
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 40,
		paddingBottom: 20,
		paddingTop: 60,
		backgroundColor: COLORS.lightModeBG
	},
	logo:
	{
	  fontSize: 24,
	  fontStyle: 'italic',
	  fontWeight: 'bold'
	}
  });

export default Navbar;