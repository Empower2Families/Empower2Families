import React from 'react';
import { ScrollView, StyleSheet, View, Text, Pressable } from 'react-native';
import WideButton from '@/components/WideButton';

export default function Index() {
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <WideButton>
        </WideButton>
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
