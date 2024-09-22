import { StyleSheet, View } from 'react-native';

export default function HorizontalRule() {
  return (
    <View 
      style={{
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        padding: 0,
      }}
    />
  )
}
