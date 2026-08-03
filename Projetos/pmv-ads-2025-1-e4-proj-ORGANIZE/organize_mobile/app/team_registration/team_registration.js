import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Appearance,
} from "react-native";
import { api } from "../../services/api"; // deve ter interceptor configurado
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";

export default function TeamRegistrationScreen() {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [mounted, setMounted] = useState(false);
  const colorScheme = Appearance.getColorScheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async () => {
    if (!teamName.trim()) {
      return Alert.alert("Atenção", "O nome da equipe é obrigatório.");
    }

    try {
      // Token já será incluído automaticamente se seu interceptor estiver certo
      const response = await api.post("/task-groups", {
        name: teamName,
        description,
      });

      Alert.alert("Sucesso", "Equipe cadastrada com sucesso!");
      setTeamName("");
      setDescription("");
    } catch (error) {
      console.log("Erro ao cadastrar equipe:", error);
      const msg =
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        "Erro inesperado ao cadastrar equipe.";
      Alert.alert("Erro", msg);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Cadastro de Equipe" }} />
      <View
        style={[
          styles.container,
          colorScheme === "dark"
            ? styles.darkBackground
            : styles.lightBackground,
        ]}
      >
        <Text
          style={[
            styles.title,
            colorScheme === "dark" ? styles.textDark : styles.textLight,
          ]}
        >
          Cadastre sua Equipe
        </Text>
        <TextInput
          placeholder="Nome da Equipe"
          style={[
            styles.input,
            colorScheme === "dark" ? styles.inputDark : styles.inputLight,
          ]}
          value={teamName}
          onChangeText={setTeamName}
          placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#555"}
        />
        <TextInput
          placeholder="Descrição da Equipe"
          style={[
            styles.textarea,
            colorScheme === "dark" ? styles.inputDark : styles.inputLight,
          ]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#555"}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="CADASTRAR EQUIPE"
            onPress={handleSubmit}
            color={colorScheme === "dark" ? "#facc15" : "#fbbf24"}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  darkBackground: {
    backgroundColor: "#1a1a1a",
  },
  lightBackground: {
    backgroundColor: "#fef3c7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  textDark: {
    color: "#facc15",
  },
  textLight: {
    color: "#92400e",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  inputDark: {
    backgroundColor: "#333",
    color: "#fff",
    borderColor: "#555",
  },
  inputLight: {
    backgroundColor: "#fff",
    color: "#000",
    borderColor: "#ddd",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 12,
  },
});
