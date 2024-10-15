import { View, Text, StyleSheet } from 'react-native'

function index() {
  return (
    <View style={style.screen}>
      <Text>
        Game
      </Text>
    </View>
  )
}

const style = StyleSheet.create({
  screen:{
    flex:1
  }
})

export default index
