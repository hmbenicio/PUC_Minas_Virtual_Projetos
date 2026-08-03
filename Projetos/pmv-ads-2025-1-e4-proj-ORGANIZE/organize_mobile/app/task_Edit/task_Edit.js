import { Text, View, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function Task_EditScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Editar Tarefas" }} />
      <View style={styles.container}>
        <Text style={styles.text}>Tela de Editar Tarefas</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
