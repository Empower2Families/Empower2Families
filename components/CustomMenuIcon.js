import React from "react";
import { StyleSheet, View } from "react-native";

const CustomMenuIcon = () => {
  return (
    <View style={styles.container}>
      <View style={styles.lineTop} />
      <View style={styles.lineBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 25,
    height: 10,
    justifyContent: "space-between",
    alignItems: 'flex-end'
  },
  lineTop: {
    width: "60%",
    height: 3,
    backgroundColor: "#000",
    borderRadius: 10
  },
  lineBottom: {
    width: "100%",
    height: 3,
    backgroundColor: "#000",
    borderRadius: 10
  },
});

export default CustomMenuIcon;
