import { Text, View, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function OpenMapaScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Localização" }} />
      <View style={styles.container}>
        <Text style={styles.text}>Tela de Localização</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1E5",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#2F3131",
    textAlign: "justify",
    textAlignVertical: "center",
    padding: 25,
    margin: 0,
  },
});
