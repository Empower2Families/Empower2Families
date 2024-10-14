import React from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Link, router } from "expo-router"

import { COLORS } from "../constants/Colors"

// Component that contains the 'E2F' logo and home button
// TODO style text component separate from logo
export default function Navbar() {
  return (
    <View style={navStyles.navbarContainer}>
      <Text style={navStyles.logo}>E2F</Text>
      {!router.canGoBack() ? (
        <Text style={navStyles.logo}>{getGreeting()}</Text>
      ) : (
        <Link href="/" asChild>
          <Pressable>
            <MaterialCommunityIcons name="home" size={32} color="black" />
          </Pressable>
        </Link>
      )}
    </View>
  )
}

function getGreeting() {
  // Determine time of day and set greeting
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}

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
