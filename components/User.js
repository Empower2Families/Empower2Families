import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SmallButton from "./SmallButton";

const User = () => {

	const handleButtonPress = () => {
		Alert.alert('Button Pressed');
	  };

	return(
	<View style={userStyles.userContainer}>
		<View style={userStyles.account}>
			<MaterialCommunityIcons name="account-circle" size={44} color="#000" style={userStyles.icon}/>
			<View>
				<Text style={userStyles.userName}>Hello, Joshua!</Text>
				<Text style={userStyles.greeting}>Good Morning</Text>
			</View>
		</View>
		<SmallButton text="Child Info" onPress={handleButtonPress} />
	</View>
	);
}

const userStyles = StyleSheet.create({
	userContainer:
	{
		flexDirection: "row",
		marginTop: 35,
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	account:
	{

		alignItems: 'center',
		flexDirection: "row",
	},
	userName:
	{
		fontWeight: 900,
		fontSize: 15
	},
	greeting:
	{
		fontSize: 12,
		fontWeight: 500,
		color: '#A3A3A3'
	},
	icon:
	{
		marginRight: 5
	}
  });

export default User;