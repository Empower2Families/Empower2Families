import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import SmallButton from "./SmallButton";

// Component: Reflections
// Purpose: Contains Small Buttons that will take the user to the page for each of the four reflections.
const Reflections = ({navigation}) => {
  const screenWidth = Dimensions.get("window").width;
  
  const navigateToGoals = () => {
    navigation.navigate("Goals")
  }

  const navigateToAchievements = () => {
    navigation.navigate("Achievements")
  }

  const navigateToStressors = () => {
    navigation.navigate("Stressors")
  }

  const navigateToSupports = () => {
    navigation.navigate("Supports")
  }

  return (
    <View style={reflectionsStyles.reflectionsContainer}>
      <Text style={reflectionsStyles.title}>Reflections</Text>
      <View style={reflectionsStyles.buttons}>
        <SmallButton text="Goals" containerWidth={screenWidth} onPress={navigateToGoals}/>
        <SmallButton text="Achievements" containerWidth={screenWidth} onPress={navigateToAchievements}/>
        <SmallButton text="Stressors" containerWidth={screenWidth} onPress={navigateToStressors}/>
        <SmallButton text="Supports" containerWidth={screenWidth} onPress={navigateToSupports}/>
      </View>
    </View>
  );
};

const reflectionsStyles = StyleSheet.create({
  reflectionsContainer: {
    marginTop: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default Reflections;
