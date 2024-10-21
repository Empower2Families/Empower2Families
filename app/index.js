import React, {useState, useEffect, useMemo} from 'react'
import {ScrollView, StyleSheet, Text, View, Pressable, Button, Alert} from 'react-native'
import {CloudStorage, CloudStorageProvider, CloudStorageScope, useIsCloudAvailable} from "react-native-cloud-storage";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useSQLiteContext} from "expo-sqlite";
import {useDrizzleStudio} from "expo-drizzle-studio-plugin";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from 'expo-web-browser';

import {COLORS} from '../constants/Colors'
import WideNavButton from '../components/WideNavButton'
import SmallNavButton from "../components/SmallNavButton";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {router} from "expo-router";
import {GoogleSignin, statusCodes} from "@react-native-google-signin/google-signin";

WebBrowser.maybeCompleteAuthSession();

export default function Home() {
  const db = useSQLiteContext()
  useDrizzleStudio(db)

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.userContainer}>
          {/*<Login/>*/}
          <SyncStatus/>
          <SmallNavButton text="Child Info" navTo="child-info"/>
        </View>

        <WideNavButton text="Resources" navTo="/resources"/>
      </View>
    </ScrollView>
  )
}

const Login = () => {
  const [accessToken, setAccessToken] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '',
    scopes: ['https://www.googleapis.com/auth/drive.appdata'],
  })
  const cloudStorage = new CloudStorage(CloudStorageProvider.GoogleDrive, {strictFilenames: true})
//  const cloudAvailable = useIsCloudAvailable(cloudStorage)
//
//  useEffect(() => {
//    console.log(cloudAvailable ? 'Cloud storage available' : 'Cloud storage not available');
//  }, [cloudAvailable])

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken);
    }

    if (accessToken && cloudStorage.getProvider() === CloudStorageProvider.GoogleDrive) {
      cloudStorage.setProviderOptions({accessToken});
    }
  }, [response, accessToken, cloudStorage]);

  const writeFileAsync = () => {
    return cloudStorage.writeFile('/.keep', '', CloudStorageScope.AppData).then(() => {
      console.log("worked")
      return cloudStorage.writeFile('test.txt', 'Hello World', CloudStorageScope.AppData);
    }, (reason) => console.log("failed ", reason))
  };

  const printFileAsync = () => {
    cloudStorage.readFile("test.txt", CloudStorageScope.AppData).then((mystr) => {
      console.log(mystr)
    }, reason => console.log(reason))
  }

  return (
    <View style={styles.container}>
      {CloudStorage.getProvider() === CloudStorageProvider.GoogleDrive && !accessToken ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => promptAsync()}
        />
      ) : (
        <Button
          title="Write Hello World to test.txt"
          onPress={() => {
            writeFileAsync().then(() => printFileAsync())
          }}
        />
      )}
    </View>
  );
};

function SyncStatus() {
  return (
    <Pressable>
      <View style={{alignItems: "center", flexDirection: "row"}}>
        <MaterialCommunityIcons name="account-circle" size={40} color="#000" style={{marginRight: 5}}/>
        <View>
          <Text style={styles.userNameMainText}>Hello, (TEMP)</Text>
          <Text style={styles.userNameSmallText}>sync status</Text>
        </View>
      </View>
    </Pressable>
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
  userContainer: {
    flexDirection: "row",
    marginTop: 0,
    alignItems: "center",
    justifyContent: "space-between"
  },
  userNameMainText: {
    fontWeight: "bold",
    fontSize: 15,
    display: "flex",
    flexWrap: "wrap"
  },
  userNameSmallText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#A3A3A3"
  }
})

