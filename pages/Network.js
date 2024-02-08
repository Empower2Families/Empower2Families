import * as Contacts from 'expo-contacts';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AddButton from '../components/AddButton';
import Contact from '../components/Contact';

const Network = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        setContacts(data);
      }
    })();
  }, []);

  return (
    <View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Contacts Module Example</Text>
          {contacts.map((contact, index) => (
            <Contact key={index} name={contact.name} />
          ))}
        </View>
      </ScrollView>
      <AddButton/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 40,
	  paddingBottom: 40,
	  paddingTop: 10,
    backgroundColor: "white"
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default Network;
