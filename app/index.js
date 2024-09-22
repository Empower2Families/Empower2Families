import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import HorizontalRule from '@/components/HorizontalRule';

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
        <HorizontalRule />
        <ScrollView horizontal={true}>
        </ScrollView>

        <Text>My Network</Text>
        <HorizontalRule />
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
