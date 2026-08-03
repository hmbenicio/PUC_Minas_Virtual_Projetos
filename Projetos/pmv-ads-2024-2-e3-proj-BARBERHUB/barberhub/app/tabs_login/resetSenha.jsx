import { View, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../assets/firebase.config";

import Button from "@/components/ButtonSaveCancel";
import ImageViewer from "@/components/ImageViewerLogo";

const PlaceholderImage = require("@/assets/images/logo.png");

export default function RedefinirSenhaScreen() {
  const [selectedImage] = useState(undefined);
  const [email, setEmail] = useState("");
  const router = useRouter();

  function RedefinirSenha() {
    if (email !== "") {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          Alert.alert(
            "Foi enviado um e-mail para: " +
              email +
              ". Verifique a sua caixa de e-mail."
          );
          router.push("login");
        })
        .catch((error) => {
          const errorMessage = error.message;
          Alert.alert(
            "Ops! Alguma coisa não deu certo. " +
              errorMessage +
              ". Tente novamente ou pressione Cancelar."
          );
          return;
        });
    } else {
      Alert.alert(
        "É preciso informar um e-mail válido para efetuar a redefinição de senha."
      );
      return;
    }
  }

  const Cancel = async () => {
    router.push("login");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Redefinir senha" }} />
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
            placeholder="Digite o e-mail para redefinir a senha."
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View style={styles.footerContainer}>
          <Button
            theme="confirmar"
            label="Redefinir senha"
            onPress={RedefinirSenha}
          />
          <Button theme="cancelar" label="Cancelar" onPress={Cancel} />
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
