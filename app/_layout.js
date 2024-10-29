import {Stack} from 'expo-router'
import {SQLiteProvider} from "expo-sqlite";

import Navbar from '@/components/Navbar';
import * as UserData from "@/data/User";

// Structure component, content placed here will exist on all pages
export default function RootLayout() {
  // TODO add database loading screen with react suspense
  return (
    <SQLiteProvider databaseName="user.db" onInit={UserData.migrateDbIfNeeded}>
      <Stack screenOptions={({navigation}) => ({
        header: () => <Navbar navigation={navigation}/>,
      })}>
        {/* Content for each page will be placed here */}
        <Stack.Screen name="index"/>
        <Stack.Screen name="child-info"/>
        <Stack.Screen name="resources"/>
      </Stack>
    </SQLiteProvider>
  )
}

