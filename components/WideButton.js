import { Pressable, StyleSheet } from "react-native"

export default function WideButton() {
  return (
    <Pressable style={style.button}>

    </Pressable>
  )
}

const style = StyleSheet.create({
  button: {
    width: '100%',
    height: 50, // TODO for some reason setting height as percentage doesn't work
    backgroundColor: 'steelblue',
  }
})
