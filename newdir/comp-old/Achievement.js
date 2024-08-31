import { format } from 'date-fns'; // Import the date-fns library for formatting
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Achievement = ({ text, timestamp }) => {
  // Format the timestamp using date-fns library
  const formattedDate = timestamp ? format(new Date(timestamp), 'MMM dd, yyyy') : '';
  const formattedTime = timestamp ? format(new Date(timestamp), 'hh:mm a') : '';

  return (
    <View style={listItemStyles.container}>
        <Text style={listItemStyles.goalText}>
          {text}
        </Text>
        <View style={listItemStyles.time}>
          <Text style={listItemStyles.dateText}>{formattedDate}</Text>
          <Text style={listItemStyles.timeText}>{formattedTime}</Text>
        </View>
    </View>
  );
};

const listItemStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  goalText: {
    fontSize: 15,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    width: '60%', // Adjust the width as needed
  },
  time: {
	textAlign: 'right'
  },	
  dateText: {
    fontSize: 12,
    color: 'gray',
	textAlign: 'right'
  },
  timeText: {
    fontSize: 12,
    fontWeight: 'bold',
	textAlign: 'right'
  },
  goalItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignItems: 'center',
  },
});

export default Achievement;
