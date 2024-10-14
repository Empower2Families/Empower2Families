import React, {useEffect, useState} from 'react'
import {ScrollView, StyleSheet, Text, View, Button} from 'react-native'
import {CloudStorage, CloudStorageProvider, CloudStorageScope} from 'react-native-cloud-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import {COLORS} from '../constants/Colors'
import WideNavButton from '../components/WideNavButton'

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [accessToken, setAccessToken] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    // if you're also deploying to web, uncomment the next line
//    webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/drive.appdata'],
  });

  useEffect(() => {
    console.log(response)
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken);
    }

    if (accessToken && CloudStorage.getProvider() === CloudStorageProvider.GoogleDrive) {
      CloudStorage.setProviderOptions({accessToken});
    }
  }, [response, accessToken]);

  const writeFileAsync = () => {
    return CloudStorage.writeFile('test.txt', 'Hello World', CloudStorageScope.AppData);
  };

  return (
    <View style={styles.container}>
      {CloudStorage.getProvider() === CloudStorageProvider.GoogleDrive && !accessToken ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        <Button
          title="Write Hello World to test.txt"
          onPress={() => {
            writeFileAsync();
          }}
        />
      )}
    </View>
  );
};


//function SyncStatus() {
//  // Check if we can sync with a cloud storage provider
//  const cloudAvailable = useIsCloudAvailable()
//
//  useEffect(() => {
//    if (CloudStorage.getProvider() === CloudStorageProvider.GoogleDrive) {
//
//    }
//  }, [])
//
//  return (
//    <View>
//      {cloudAvailable ? (
//        <Text>Works!</Text>
//      ) : (
//        <Text>No Cloud provider!</Text>
//      )}
//    </View>
//  )
//}

export default function Home() {
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Login/>
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

