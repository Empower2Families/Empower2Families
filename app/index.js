import {ScrollView, StyleSheet, View} from 'react-native'
import {useSQLiteContext} from "expo-sqlite";
import {useDrizzleStudio} from "expo-drizzle-studio-plugin";

import {COLORS} from '@/constants/Colors'
import SignInButton from "@/components/SignInButton";
import WideNavButton from '@/components/WideNavButton'
import SmallNavButton from "@/components/SmallNavButton";
import ButtonGrid from "@/components/ButtonGrid"
import RecentAchievements from "@/components/RecentAchievements";


export default function Home() {
  const db = useSQLiteContext()
  useDrizzleStudio(db)

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <SignInButton/>
          <SmallNavButton text="Child Info" navTo="child-info"/>
        </View>
        <WideNavButton text="My Network" navTo=""/>
        <ButtonGrid text="Reflections" buttonInfo={reflectionButtons}/>
        <RecentAchievements/>
        <WideNavButton text="Resources" navTo="resources"/>
      </View>
    </ScrollView>
  )
}

const reflectionButtons = [
  {
    text: "Goals",
    nav: ""
  },
  {
    text: "Achievements",
    nav: ""
  },
  {
    text: "Stressors",
    nav: ""
  },
  {
    text: "Supports",
    nav: ""
  }
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.lightModeBG,
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 10
  },
  userContainer: {
    flexDirection: "row",
    marginTop: 0,
    alignItems: "center",
    justifyContent: "space-between"
  },
  scrollContainer: {
    flexGrow: 1,
    width: 'auto',
  },
})

