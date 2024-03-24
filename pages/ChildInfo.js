import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { COLORS } from '../constants';
import app from '../config/firebaseConfig';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChildInfo = ({ navigation }) => {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChildInfo, setHasChildInfo] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const db = app.db;
  const user = app.auth.currentUser;

  const getChildInfo = async () => {
    setIsLoading(true);
    if (user) {
      const childInfoRef = doc(db, 'childInfo', user.uid);
      
      try {
        const childInfoDoc = await getDoc(childInfoRef);
        const childInfoData = childInfoDoc.data();

        if (!childInfoData || Object.keys(childInfoData).length === 0) {
          setHasChildInfo(false);
        } else {
          const { name, birthday, bio } = childInfoData;
          setName(name);
          setBirthday(birthday); // Set birthday directly
          setBio(bio);
        }
      } catch (error) {
        console.error('Error fetching childInfo document:', error);
        setHasChildInfo(false);
      } finally {
        setIsLoading(false);
      }
    }
  };


  useEffect(() => {

    getChildInfo();
  }, [user, db]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  handleAddChildInfo = () => {
    toggleModal();
  }

  const handleSubmitChildInfo = async () => {
    try {
      const userRef = doc(db, 'childInfo', user.uid);
      await setDoc(userRef, {
        name: name,
        birthday: birthday, // Store birthday as a string
        bio: bio,
      });
      toggleModal();
      getChildInfo();
    } catch (error) {
      console.error('Error updating child info:', error);
    }
  };

  return (
    <View style={styles.overCon}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Child Info</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : hasChildInfo ? (
            <View style={styles.childInfo}>
              <View style={styles.circle}></View>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.birthday}>
                {birthday}
              </Text>
              <Text style={styles.bio}>
                <Text style={styles.bioTitle}>Bio: </Text>
                {bio}
              </Text>
            </View>
          ) : (
            <View style={styles.emptyMessageContainer}>
              <Text style={styles.noChildInfoText}>
                You haven’t added your child’s info,{' '}
                <TouchableOpacity onPress={handleAddChildInfo} style={styles.noChildInfoContainer}>
                  <Text style={styles.addInfo}>click here to add.</Text>
                </TouchableOpacity>
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <MaterialCommunityIcons name="close" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Child Info</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Birthday"
              value={birthday}
              onChangeText={(text) => setBirthday(text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Bio"
              value={bio}
              onChangeText={(text) => setBio(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmitChildInfo}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overCon: {
    flex: 1,
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
  name: {
    fontSize: 24,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  birthday: {
    fontSize: 24,
    marginBottom: 15,
    fontWeight: 'bold',
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
  buttonText: {
    color: COLORS.lightText,
    fontWeight: 'bold'
    },
  scrollContainer: {
    flexGrow: 1,
  },
  circle: {
    width: 225,
    height: 225,
    borderRadius: 150,
    backgroundColor: '#d3d3d3',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  childInfo: {
    alignItems: 'center',
  },
  bio: {
    fontSize: 20,
    textAlign: 'center',
    width: 250
  },
  bioTitle: {
    fontWeight: 'bold',
  },
  noChildInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18
  },
  noChildInfoText: {
    fontSize: 18,
    textAlign: 'center',
  },
  addInfo: {
    color: COLORS.primaryColor,
    fontSize: 18
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '60%', // Adjust as needed
  },
});

export default ChildInfo;
