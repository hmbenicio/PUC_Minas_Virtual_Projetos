import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { api } from "../../services/api"; // ajuste conforme sua estrutura
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ResetPassScreen() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  const accessLogin = async () => {
    router.push("/login/login");
  };

  const handleUpdatePassword = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert(
          "Erro",
          "Você precisa estar autenticado para atualizar a senha."
        );
        return;
      }

      const response = await api.patch(
        "/user/password-update",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Sucesso", "Senha atualizada com sucesso!");
        router.push("login/login");
      } else {
        Alert.alert(
          "Erro",
          response.data?.message || "Erro ao atualizar senha."
        );
      }
    } catch (error) {
      console.error("Erro:", error);
      Alert.alert(
        "Erro",
        error?.response?.data?.message || "Erro ao conectar com o servidor."
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Atualizar Senha" }} />
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Atualizar Senha</Text>
        <Text style={styles.subtitle}>
          Digite sua senha atual e a nova senha
        </Text>

        <ImageBackground
          source={require("../../assets/images/postit2.png")}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardContent}>
            <Text style={styles.label}>Senha Atual</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha atual"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />

            <Text style={styles.label}>Nova Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a nova senha"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleUpdatePassword}
            >
              <Text style={styles.buttonText}>Atualizar Senha</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={accessLogin}>
              <Text style={styles.link}>Voltar para o Login</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8dc",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#94a3b8",
  },
  subtitle: {
    fontSize: 18,
    color: "#94a3b8",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    width: "100%",
    maxWidth: 380,
    aspectRatio: 360 / 360,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  cardImage: {
    resizeMode: "stretch",
    borderRadius: 16,
    opacity: 0.85,
  },
  cardContent: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 34,
    justifyContent: "flex-start",
  },
  label: {
    color: "#000",
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#2d2d2d",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#ffbf00",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#1d4ed8",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    textAlign: "center",
  },
});
