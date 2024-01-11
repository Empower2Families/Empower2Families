import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SmallButton from "./SmallButton";

const Reflections = () => {
	return (
		<View style={reflectionsStyles.reflectionsContainer}>
			<Text style={reflectionsStyles.title}>Reflections</Text>
			<View style={reflectionsStyles.buttons}>
				<SmallButton text="Goals"/>
				<SmallButton text="Achievements"/>
				<SmallButton text="Stressors"/>
				<SmallButton text="Supports"/>
			</View>
		</View>
	);
}

const reflectionsStyles = StyleSheet.create({
	reflectionsContainer:
	{
		marginTop: 15,
	},
	title:
	{
		fontWeight: 900,
		fontSize: 15,
	},
	buttons:
	{
		flexDirection: 'row', // Arrange items in a row
		flexWrap: 'wrap', // Allow items to wrap to the next row
		justifyContent: 'space-between', // Add space between items
	}
  });

export default Reflections;