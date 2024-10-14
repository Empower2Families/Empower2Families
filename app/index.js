import React, {useEffect} from 'react'
import {ScrollView, StyleSheet, Text, View} from 'react-native'

import {COLORS} from '../constants/Colors'
import WideNavButton from '../components/WideNavButton'
import {CloudStorage, CloudStorageProvider, useIsCloudAvailable} from 'react-native-cloud-storage'

function SyncStatus() {
  // Check if we can sync with a cloud storage provider
  const cloudAvailable = useIsCloudAvailable()

  useEffect(() => {
    if (CloudStorage.getProvider() === CloudStorageProvider.GoogleDrive) {

    }
  }, [])

  return (
    <View>
      {cloudAvailable ? (
        <Text>Works!</Text>
      ) : (
        <Text>No Cloud provider!</Text>
      )}
    </View>
  )
}

export default function Home() {
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <SyncStatus/>
        <WideNavButton text="Resources" navTo="/resources"/>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.lightModeBG,
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 10
  },
  scrollContainer: {
    flexGrow: 1,
    width: 'auto',
  },
})


