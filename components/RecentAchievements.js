import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Tile from "./Tile";

const RecentAchievements = () => {
	return(
		<View style={raStyles.raContainer}>
			<Text style={raStyles.title}>Recent Achievements</Text>
			<View style={raStyles.tileContainer}>
				<Tile text="One"/>
				<Tile text="Two" />
				<Tile text="Three"/>
			</View>
		</View>
	)
}

const raStyles = StyleSheet.create ({
	raContainer: {
		marginTop: 10
	},
	title: {
		fontWeight: "bold",
		fontSize: 15,
	  },
	tileContainer: {
		flexDirection: "row",
		justifyContent: "space-between"
	}
}) 

export default RecentAchievements;