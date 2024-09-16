import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import WideButton from '../components/WideButton';

export default function Index() {
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* <User navigation={navigation} /> */}
        <WideButton text="My Network" onPress={() => {}} />
        {/* <Reflections navigation={navigation} /> */}
        {/* <RecentAchievements /> */}
        {/* <WideButton text="Resources" onPress={navigateToResources} /> */}
        {/* <StatusBar style="auto" /> */}
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
