// Achievements.js
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Achievement from '../components/Achievement';
import AddButton from '../components/AddButton';
import app from '../config/firebaseConfig';
import { COLORS } from '../constants';

const Achievements = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [achievements, setAchievments] = useState([]);
  const [newAchievementText, setNewAchievementText] = useState(''); // State for the new achievement text
  const db = app.db;
  const user = app.auth.currentUser;
  const [editModalVisible, setEditModalVisible] = useState(false); // New state for edit modal

  const emptyMessage = "You don’t have any goals added yet, click the blue plus sign to add one!";

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const getAchievements = async () => {
    setIsLoading(true);
  
    if (user) {
      const achievementsRef = doc(db, 'achievements', user.uid);
  
      try {
        const achievementsDoc = await getDoc(achievementsRef);
        const achievementsData = achievementsDoc.data()?.achievements || [];
  
        setAchievments(
          achievementsData.map((achievement, index) => ({
            id: index.toString(),
            text: achievement.name,
            // Assuming you want to display the accomplishment timestamp as well
            timestamp: achievement.accomplished,
          }))
        );
      } catch (error) {
        console.error('Error fetching achievements document:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const addAchievement = async () => {
    try {
      const userRef = doc(db, 'achievements', user.uid);
  
      // Get the current achievements array from the document
      const userDoc = await getDoc(userRef);
      const currentAchievements = userDoc.data()?.achievements || [];
  
      // Check if the input is not empty
      if (newAchievementText.trim().length > 0) {
        // Add the new achievement to the array
        currentAchievements.push({ name: newAchievementText, accomplished: new Date().toISOString() });

        // Update the document with the modified array
        await setDoc(userRef, {
          achievements: currentAchievements,
        });

        toggleModal(); // Close the modal after adding achievement
        // Refresh the achievements array
        getAchievements();
      } else {
        setErrorMessage('Achievement cannot be blank.');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAchievements();
  }, []);

  return (
    <MenuProvider>
      <View style={styles.overCon}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Achievements</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primaryColor} />
            ) : achievements.length === 0 ? (
              <View style={styles.emptyMessageConatiner}>
                <Text style={styles.emptyMessage}>{emptyMessage}</Text>
              </View>
            ) : (
              achievements.map((achievement) => (
                <Achievement key={achievement.id} text={achievement.text} timestamp={achievement.timestamp} id={achievement.id} />
              ))
            )}
          </View>
        </ScrollView>
        <AddButton onPress={toggleModal} />
        <Modal visible={isModalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            {errorMessage !== '' && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                <MaterialCommunityIcons name="close" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Achievement</Text>
              <Text style={styles.info}>Add your achievements here!</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your achievement here ..."
                value={newAchievementText}
                onChangeText={setNewAchievementText} // Update the state with the new value
              />
              <TouchableOpacity style={styles.button} onPress={addAchievement}>
                <Text style={styles.buttonText}>Add Achievement</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={editModalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Support</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your edited support here ..."
              />
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  overCon: {
    height: '100%',
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    width: 'auto',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 12
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    backgroundColor: COLORS.primaryColor,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    height: 60,
    width: 180
  },
  buttonText: {
    color: COLORS.lightText,
    fontWeight: 'bold'
  },
  info: {
    color: 'grey',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 12
  },
  // Style for the 'X' button
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#ffe8e9',
    margin: 50,
  },
  emptyMessage: {
    fontSize: 20,
    textAlign: 'center',
    color: 'grey',
    marginTop: '60%',
    width: '60%'
  },
  emptyMessageConatiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Achievements;
