import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import app from '../config/firebaseConfig';
import Tile from './Tile';

const RecentAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const db = app.db;
  const user = app.auth.currentUser;

  const achievementsRef = doc(db, 'achievements', user.uid);

  const fetchAchievements = async () => {
    try {
      const achievementsDoc = await getDoc(achievementsRef);
      const achievementsData = achievementsDoc.data()?.achievements || [];
      return achievementsData.map((achievement, index) => ({
        id: index.toString(),
        text: achievement.name,
        timestamp: achievement.accomplished,
      }));
    } catch (error) {
      console.error('Error fetching achievements document:', error);
      return [];
    }
  };

  const getAchievements = async () => {
    setIsLoading(true);
    const achievementsData = await fetchAchievements();
    const sortedAchievements = achievementsData.sort((a, b) => b.timestamp - a.timestamp);
    const recentAchievements = sortedAchievements.slice(-3).reverse();
    setAchievements(recentAchievements);
    setIsLoading(false);
  };

  useEffect(() => {
    // Fetch achievements initially
    getAchievements();

    // Set up real-time listener for achievements document
    const unsubscribe = onSnapshot(achievementsRef, () => {
      // When the document changes, fetch achievements again
      getAchievements();
    });

    // Clean up the listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={raStyles.raContainer}>
      <Text style={raStyles.title}>Recent Achievements</Text>
      <View style={raStyles.tileContainer}>
        {achievements.map((achievement) => (
          <Tile key={achievement.id} text={achievement.text} timestamp={achievement.timestamp} />
        ))}
      </View>
    </View>
  );
};

const raStyles = StyleSheet.create({
  raContainer: {
    marginTop: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  tileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default RecentAchievements;
