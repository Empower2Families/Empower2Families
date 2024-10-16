import {Pressable, Text, StyleSheet, Dimensions} from "react-native"
import {Link} from "expo-router";

import {COLORS} from '../constants/Colors'

export default function SmallNavButton({text, navTo}) {
    const containerWidth = Dimensions.get('window').width;
    const buttonWidth = containerWidth / 2.8;

    return (
        <Link href={navTo} asChild>
            <Pressable style={{...smallButtonStyles.button, width: buttonWidth}}>
                <Text style={smallButtonStyles.buttonText}>{text}</Text>
            </Pressable>
        </Link>
    )
}

const smallButtonStyles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primaryColor,
        padding: 10,
        borderRadius: 5,
        marginVertical: 14,
        height: 85,
        justifyContent: 'flex-end',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
})