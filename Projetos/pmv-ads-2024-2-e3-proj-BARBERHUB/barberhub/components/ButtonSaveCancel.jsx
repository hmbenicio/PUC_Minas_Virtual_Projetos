import { StyleSheet, View, Pressable, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function ButtonSaveCancel({ label, theme, onPress }) {
  if (theme === "confirmar") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: "#426E86", borderRadius: 18 },
        ]}
      >
        <Pressable
          style={[styles.button, { backgroundColor: "green" }]}
          onPress={onPress}
        >
          <MaterialCommunityIcons
            name="check-bold"
            size={30}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: "#fff" }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  if (theme === "cancelar") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: "#F9BA32", borderRadius: 18 },
        ]}
      >
        <Pressable
          style={[styles.button, { backgroundColor: "red" }]}
          onPress={onPress}
        >
          <MaterialCommunityIcons
            name="cancel"
            size={30}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: "#fff" }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 200,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#2F3131",
    fontSize: 18,
  },
});
