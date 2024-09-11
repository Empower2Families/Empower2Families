import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants";
import CustomMenuIcon from "./CustomMenuIcon";
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Component that contains the 'E2F' logo and Hamburger menu
const Navbar = () => {
    const navigation = useNavigation();

    const navigateToHome = () => {
        navigation.navigate("Home");
    }

    const openNav = () => {
        console.log('Navigation pane opened!');
    }

    const isHomePage = !navigation.canGoBack();

    return (
        <View style={navStyles.navbarContainer}>
            <Pressable onPress={navigateToHome}>
                {isHomePage ? (
                    <Text style={navStyles.logo}>E2F</Text>
                ) : (
                    <MaterialCommunityIcons name="arrow-left" size={32} color="black" />
                )}
            </Pressable>
            <Pressable onPress={openNav}>
                {/*<CustomMenuIcon />*/}
            </Pressable>
        </View>
    );
};

const navStyles = StyleSheet.create({
    navbarContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 20,
        paddingTop: 60,
        backgroundColor: COLORS.lightModeBG
    },
    logo: {
        fontSize: 24,
        fontStyle: 'italic',
        fontWeight: 'bold'
    }
});

export default Navbar;
