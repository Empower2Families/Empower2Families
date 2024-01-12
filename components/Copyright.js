import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Copyright = () => {
	return (
		<View style={copyrightStyles.copyrightContainer}>
			<Text style={copyrightStyles.text}>© 2024 YourCompany, All Rights Reserved</Text>
		</View>
	)
}

const copyrightStyles = StyleSheet.create({
	copyrightContainer:
	{
		marginTop: 15
	},	
	text: 
	{
		textAlign: "center",
		fontSize: 10,
		color: 'grey'
	}
})

export default Copyright;