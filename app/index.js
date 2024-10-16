import React, {useState, useEffect} from 'react'
import {ScrollView, StyleSheet, Text, View, Pressable, Button} from 'react-native'
import {CloudStorage, CloudStorageProvider, CloudStorageScope} from "react-native-cloud-storage";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useSQLiteContext} from "expo-sqlite";
import {useDrizzleStudio} from "expo-drizzle-studio-plugin";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from 'expo-web-browser';

import {COLORS} from '../constants/Colors'
import WideNavButton from '../components/WideNavButton'
import SmallNavButton from "../components/SmallNavButton";

WebBrowser.maybeCompleteAuthSession();

export default function Home() {
  const db = useSQLiteContext()
  useDrizzleStudio(db)

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <Login/>
          {/*<SyncStatus/>*/}
          {/*<SmallNavButton text="Child Info" navTo="child-info"/>*/}
        </View>

        <WideNavButton text="Resources" navTo="/resources"/>
      </View>
    </ScrollView>
  )
}


const Login = () => {
  const [accessToken, setAccessToken] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'TODO how to manage secrets',
    scopes: ['https://www.googleapis.com/auth/drive.appdata'],
  });

  useEffect(() => {
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

