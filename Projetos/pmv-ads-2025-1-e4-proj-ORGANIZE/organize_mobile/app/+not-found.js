import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Stack, useRouter } from "expo-router";

export default function NotFoundScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme(); // 'dark' ou 'light'
  const isDarkMode = colorScheme === "dark";

  const accessLogin = async () => {
    router.push("/(tabs)/home");
  };

  return (
    <>
      <Stack.Screen options={{ title: "404 - Não encontrado" }} />
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "#111827" : "#ffffff" }, // bg-gray-900 ou white
        ]}
      >
        <Text
          style={[styles.title, { color: isDarkMode ? "#ffffff" : "#000000" }]}
        >
          Página não encontrada!
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? "#d1d5db" : "#1f2937" },
          ]}
        >
          Essa página pode estar em desenvolvimento!
        </Text>

        <TouchableOpacity style={styles.button} onPress={accessLogin}>
          <Text style={styles.buttonText}>Voltar para página inicial</Text>
        </TouchableOpacity>

        <Image
          source={require("../../organize_mobile/assets/images/postit_error.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ffbf00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 220,
    height: 220,
    marginTop: 32,
  },
});
