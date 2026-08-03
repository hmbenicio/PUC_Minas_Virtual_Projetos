import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function CreateScreen() {
  const router = useRouter();

  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Email2, setEmail2] = useState("");
  const [Password, setPassword] = useState("");
  const [Password2, setPassword2] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [resEmpty, setResEmpty] = useState(true);
  const [resEmail, setResEmail] = useState(true);
  const [resPassword, setRespassword] = useState(true);

  const accessLogin = async () => {
    router.push("/login/login");
  };

  const handleSubmit = async () => {
    if (!Name || !Email || !Email2 || !Password || !Password2) {
      setResEmpty(false);
      return;
    } else {
      setResEmpty(true);
    }

    if (Email !== Email2) {
      setResEmail(false);
      return;
    } else {
      setResEmail(true);
    }

    if (Password !== Password2) {
      setRespassword(false);
      return;
    } else {
      setRespassword(true);
    }

    try {
      const response = await axios.post("http://10.0.2.2:3000/organize/user", {
        name: Name,
        email: Email,
        password: Password,
      });

      if (response.status === 201) {
        Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
        setName("");
        setEmail("");
        setEmail2("");
        setPassword("");
        setPassword2("");
        router.push("login/login");
      }
    } catch (error) {
      console.log("Erro ao cadastrar:", error);
      Alert.alert("Erro", error.response?.data?.msg || "Erro ao cadastrar.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Cadastro" }} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>OrgaNize</Text>
          <Text style={styles.subtitle}>
            Organize seu dia do jeito mais nice!
          </Text>
        </View>

        <Text style={styles.title}>Cadastre-se</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#ccc"
          value={Name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={Email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirme email"
          placeholderTextColor="#ccc"
          value={Email2}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail2}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha"
            placeholderTextColor="#ccc"
            secureTextEntry={!showPassword1}
            value={Password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword1(!showPassword1)}>
            <Ionicons
              name={showPassword1 ? "eye-off" : "eye"}
              size={24}
              color="#ccc"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirme a senha"
            placeholderTextColor="#ccc"
            secureTextEntry={!showPassword2}
            value={Password2}
            onChangeText={setPassword2}
          />
          <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}>
            <Ionicons
              name={showPassword2 ? "eye-off" : "eye"}
              size={24}
              color="#ccc"
            />
          </TouchableOpacity>
        </View>

        {!resEmpty && (
          <Text style={styles.errorText}>
            Por favor, preencha todos os campos.
          </Text>
        )}
        {!resEmail && (
          <Text style={styles.errorText}>Os emails não coincidem.</Text>
        )}
        {!resPassword && (
          <Text style={styles.errorText}>As senhas não coincidem.</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={accessLogin}>
          <Text style={styles.link}>Voltar para o Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff8dc",
    padding: 20,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  subtitle: {
    fontSize: 18,
    color: "#64748b",
    textAlign: "center",
  },
  title: {
    color: "#64748b",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#3c4043",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3c4043",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    color: "#fff",
    padding: 12,
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFD369",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#1d4ed8",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    textAlign: "center",
  },
});
