import React from 'react';
import {StyleSheet, Pressable, View} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";

import {COLORS} from '@/constants/Colors';

export default function EditButton({onPress}) {
    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={onPress}>
                <MaterialCommunityIcons name="pencil" size={30} color="#fff"/>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30, // Adjust as needed
        right: 30, // Adjust as needed
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: {width: 0, height: 2}, // For iOS shadow
        shadowOpacity: 0.8, // For iOS shadow
    },
});
