// Goals.js
import { doc, getDoc, setDoc, } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddButton from '../components/AddButton';
import Goal from '../components/Goal';
import app from '../config/firebaseConfig';
import { COLORS } from '../constants';

const Goals = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [goalText, setGoalText] = useState('');
  const [goalMet, setGoalMet] = useState(false);
  const [goals, setGoals] = useState([]);
  const db = app.db;
  const user = app.auth.currentUser;
  const [isLoading, setIsLoading] = useState(true);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const addGoal = async () => {
    try {
      const userRef = doc(db, 'goals', user.uid);
  
      // Get the current goals array from the document
      const userDoc = await getDoc(userRef);
      const currentGoals = userDoc.data()?.goals || [];
  
      // Trim whitespaces and check if goalText is not empty
      if (goalText.trim().length > 0) {
        const newGoal = { name: goalText, met: false };
        currentGoals.push(newGoal);
        toggleModal();
        getGoals();
      } else {
        setErrorMessage('Goal left blank.');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }
  
      setGoalText('');
  
      // Update the document with the modified array
      await setDoc(userRef, {
        goals: currentGoals,
      });
  
    } catch (error) {
      console.log(error);
    }
  };
  
  

  const getGoals = async () => {
    setIsLoading(true);

    if (user) {
      const goalsRef = doc(db, 'goals', user.uid);
      
      try {
        const goalsDoc = await getDoc(goalsRef);
        const goalsData = goalsDoc.data()?.goals || [];
        
        setGoals(goalsData.map((goals, index) => ({ id: index.toString(), text: goals.name,  met: goals.met ? 'T' : 'F'})));
      } catch (error) {
        console.error('Error fetching goals document:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getGoals();
  }, []);


  return (
    <MenuProvider>
      <View style={styles.overCon}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Goals</Text>
            {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primaryColor} />
          ) : goals.length === 0 ? (
            <View style={styles.emptyMessageConatiner}>
              <Text style={styles.emptyMessage}>{emptyMessage}</Text>
            </View>
          ) : ( goals.map((goal) => (
              <Goal key={goal.id} text={goal.text} met={goal.met} id={goal.id}/>)))}
          </View>
        </ScrollView>
        <AddButton onPress={toggleModal}/>
        <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
        {errorMessage !== '' && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
          <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
          <MaterialCommunityIcons name="close" size={20} color="#000" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Add Goal</Text>
            <Text style={styles.info}>Set any goals you have here and when you achieve it, mark it as met!</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your goal here ..."
              onChangeText={(text) => setGoalText(text)}
            />
            <TouchableOpacity style={styles.button} onPress={addGoal}>
              <Text style={styles.buttonText}>Add Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  overCon:{
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
    borderRadius:5,
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

export default Goals;
