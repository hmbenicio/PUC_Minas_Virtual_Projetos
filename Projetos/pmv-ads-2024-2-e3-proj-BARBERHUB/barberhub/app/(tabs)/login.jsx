import { View, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { auth } from "../../assets/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";

import Button from "@/components/ButtonLogin";
import ImageViewer from "@/components/ImageViewerLogo";

const PlaceholderImage = require("@/assets/images/logo.png");

export default function LoginScreen() {
  const [selectedImage] = useState(undefined);
  const [email, setEmail] = useState(""); // Definir estado para email
  const [password, setPassword] = useState("");
  const router = useRouter(); // Definir estado para senha

  const LoginAccount = async () => {
    if (!email || email.trim() === "") {
      Alert.alert("Digite seu e-mail, por gentileza");
      return alert;
    }

    if (!password || password.trim() === "") {
      Alert.alert("Digite sua senha, por gentileza");
      return alert;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert("Login efetuado com sucesso.");
        router.push("/");
      })

      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert("Credenciais inválidas. Tente novamente.");
        router.push("login");
      });
  };
  const CreateAccount = async () => {
    router.push("tabs_login/criarConta");
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageViewer
            imgSource={PlaceholderImage}
            selectedImage={selectedImage}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={password}
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <Link href="tabs_login/resetSenha" style={styles.button}>
            Esqueceu a senha?
          </Link>
        </View>

        <View style={styles.footerContainer}>
          <Button theme="login" label="ACESSAR" onPress={LoginAccount} />
          <Button theme="conta" label="CRIAR CONTA" onPress={CreateAccount} />
          <Button />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1E5",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    padding: 35,
    backgroundColor: "#F8F1E5",
  },
  footerContainer: {
    flex: 1,
    padding: 15,
    justifyContent: "space-evenly",
    alignContent: "center",
    margin: 10,
    alignItems: "center",
    backgroundColor: "#F8F1E5",
  },

  inputContainer: {
    flex: 1,
    padding: 15,
    justifyContent: "space-evenly",
    alignContent: "center",
    margin: 0,
    alignItems: "center",
    backgroundColor: "#F8F1E5",
  },

  input: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
    color: "#2F3131",
    fontSize: 16,
    borderWidth: 4,
    borderRadius: 18,
    borderColor: "#F9BA32",
  },
  text: {
    color: "#2F3131",
    textAlign: "justify",
    textAlignVertical: "center",
    padding: 0,
    margin: 0,
  },
});
