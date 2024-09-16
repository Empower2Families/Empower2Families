import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

/**
 * Sectioned Carosel (mynetwork, children)
 * Button-to-search (resources)
 *
 */

/*
 * | topbar (greeting)
 *
 * | Children > *[ Reflections, Achievements ] |
 * | MyNetwork |
 * | Resources |
 * | UserInfo |
 */

export default function Index() {
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text>Children</Text>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text>My Network</Text>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 10
  },
  scrollContainer: {
    flexGrow: 1,
    width: 'auto',
  },
});
