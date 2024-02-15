import * as Contacts from 'expo-contacts';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AddButton from '../components/AddButton';
import Contact from '../components/Contact';

// Function to format phone number as (###) ###-####
const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
};

const Network = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.FirstName, Contacts.Fields.PhoneNumbers]
        });

        // Remove country code from phone numbers and format them
const formattedContacts = data.map(contact => ({
  ...contact,
  phoneNumbers: contact.phoneNumbers ? contact.phoneNumbers.map(phone => ({
    ...phone,
    number: phone.number.replace(/^\+?1?/, '') // Remove +1 country code and leading 1
  })) : []
}));


        setContacts(formattedContacts);
      }
    })();
  }, []);

  return (
    <View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Contacts Module Example</Text>
          {contacts.map((contact, index) => (
            <Contact
              key={index}
              name={contact.name}
              phone={contact.phoneNumbers && contact.phoneNumbers.length > 0 ? formatPhoneNumber(contact.phoneNumbers[0].number) : 'No Phone Number'}
            />
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
