import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../services/api"; // ajuste o caminho conforme necessário

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const accessReset = () => {
    router.push("resetPass/resetPass");
  };

  const accessCreate = () => {
    router.push("create/create");
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Erro", "Preencha todos os campos.");
        return;
      }

      const response = await api.post("/user/login", {
        email,
        password,
      });

      const { token } = response.data;

      if (!token) {
        Alert.alert("Erro", "Token não retornado.");
        return;
      }

      await AsyncStorage.setItem("isAuthenticated", "true");
      await AsyncStorage.setItem("token", token);

      Alert.alert("Login bem-sucedido!");

      // Redireciona e recarrega
      router.replace("(tabs)/menu");
    } catch (error) {
      console.error("Erro no login:", error?.response?.data || error.message);
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Email ou senha incorretos ou falha na conexão."
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Login" }} />
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>OrgaNize</Text>
        <Text style={styles.subtitle}>
          Organize seu dia do jeito mais nice!
        </Text>

        <ImageBackground
          source={require("../../assets/images/postit2.png")}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Acesse sua conta</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor="#ddd"
              keyboardType="email-address"
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#ddd"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={24}
                  color="#ddd"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={accessReset}>
              <Text style={styles.link}>Redefinir a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.signup}>
              <Text style={styles.signupText}>Ainda não tem uma conta?</Text>
              <TouchableOpacity onPress={accessCreate}>
                <Text style={styles.link}>Crie sua conta</Text>
              </TouchableOpacity>
            </View>
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
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#64748b",
  },
  subtitle: {
    fontSize: 18,
    color: "#64748b",
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
  },
  cardContent: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 34,
    justifyContent: "flex-start",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 16,
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
    paddingRight: 40,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
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
    marginTop: 6,
    textAlign: "center",
  },
  signup: {
    marginTop: 20,
    alignItems: "center",
  },
  signupText: {
    color: "#444",
  },
});
