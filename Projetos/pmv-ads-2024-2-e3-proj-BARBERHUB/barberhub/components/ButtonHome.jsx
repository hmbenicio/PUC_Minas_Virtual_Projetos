import { StyleSheet, View, Pressable, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function ButtonHome({ label, theme, onPress }) {
  if (theme === "cortes") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: "#F0810F", borderRadius: 18 },
        ]}
      >
        <Pressable
          style={[styles.button, { backgroundColor: "#F9BA32" }]}
          onPress={onPress}
        >
          <FontAwesome6
            name="scissors"
            size={20}
            color="#2F3131"
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: "#2F3131" }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }

  if (theme === "limpeza") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: "#F0810F", borderRadius: 18 },
        ]}
      >
        <Pressable
          style={[styles.button, { backgroundColor: "#F9BA32" }]}
          onPress={onPress}
        >
          <MaterialIcons
            name="clean-hands"
            size={30}
            color="#2F3131"
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: "#2F3131" }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }

  if (theme === "barba") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: "#F0810F", borderRadius: 18 },
        ]}
      >
        <Pressable
          style={[styles.button, { backgroundColor: "#F9BA32" }]}
          onPress={onPress}
        >
          <MaterialCommunityIcons
            name="mustache"
            size={35}
            color="#2F3131"
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: "#2F3131" }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
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
    // fontFamily: "Inter-Black",
    color: "#2F3131",
    fontSize: 25,
  },
});
