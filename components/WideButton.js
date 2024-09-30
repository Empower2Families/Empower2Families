import { Text, Pressable, StyleSheet } from "react-native"
import { useTheme } from '@react-navigation/native'

export default function WideButton({ text, onPress }) {
  let colors = useTheme()
  return (
    <Pressable style={{ ...style.button, backgroundColor: colors.primary }}>
      <Text style={style.buttonText} onPress={onPress}>{text}</Text>
    </Pressable>
  )
}

const style = StyleSheet.create({
  button: {
    width: '100%',
    height: 85,
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: 'flex-end',
    elevation: 5,
    boxShadow: {
      color: "#000",
      radius: 10,
      opacity: 0.2,
      offset: {
        width: 2,
        height: 4,
      },
    }
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
})
