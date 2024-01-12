import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import SmallButton from "./SmallButton";

// Component: Reflections
// Purpose: Contains Small Buttons that will take the user to the page for each of the four reflections.
const Reflections = () => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={reflectionsStyles.reflectionsContainer}>
      <Text style={reflectionsStyles.title}>Reflections</Text>
      <View style={reflectionsStyles.buttons}>
        <SmallButton text="Goals" containerWidth={screenWidth} />
        <SmallButton text="Achievements" containerWidth={screenWidth} />
        <SmallButton text="Stressors" containerWidth={screenWidth} />
        <SmallButton text="Supports" containerWidth={screenWidth} />
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
    flexDirection: "row", // Arrange items in a row
    flexWrap: "wrap", // Allow items to wrap to the next row
    justifyContent: "space-between", // Add space between items
  },
});

export default Reflections;
