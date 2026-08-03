import { TextInput, View, StyleSheet, Alert } from "react-native";
import { Stack } from "expo-router";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

import Button from "@/components/ButtonSaveCancel";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../assets/firebase.config";

export default function CriarContaScreen() {
  const [selectedUser, setSelectedUser] = useState();
  const pickerRef = useRef();
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  const CriarAccount = async () => {
    if (!selectedUser || selectedUser.trim() === "") {
      Alert.alert("Selecione o tipo de usuário.");
      return;
    }
    if (!nome || nome.trim() === "") {
      Alert.alert("Digite seu nome completo, por gentileza.");
      return;
    }
    if (!contato || contato.trim() === "") {
      Alert.alert("Digite seu contato (+55 DDD Telefone)");
      return;
    }
    if (!email || email.trim() === "") {
      Alert.alert("Digite seu e-mail, por gentileza.");
      return;
    }
    if (!usuario || usuario.trim() === "") {
      Alert.alert("Crie seu usuário.");
      return;
    }
    if (!password || password.trim() === "") {
      Alert.alert("Crie uma senha.");
      return;
    }
    if (!confirmPassword || confirmPassword.trim() === "") {
      Alert.alert("Confirme sua senha.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Senha inválida!", "Digite a senha criada.");
      return;
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((UserCredencial) => {
          const user = UserCredencial.user;
          Alert.alert(
            "Bem-vindo ao BARBERHUB",
            "Credenciais criadas com sucesso!"
          );
          router.push("login");
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
          router.push("criarConta");
        });
    }
  };

  const Cancel = async () => {
    router.push("login");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Criar conta" }} />
      <View style={styles.inputContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            ref={pickerRef}
            selectedValue={selectedUser}
            onValueChange={(itemValue) => setSelectedUser(itemValue)}
          >
            <Picker.Item label="Selecione o tipo de usuário" value="" />
            <Picker.Item label="Cliente" value="cliente" />
            <Picker.Item label="Barbeiro" value="barbeiro" />
            <Picker.Item label="Barbearia" value="barbearia" />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={(text) => setNome(text)}
          keyboardType="default"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contato. Ex: +55 (DDD) 00000-0000"
          value={contato}
          onChangeText={(number) => setContato(number)}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={usuario}
          onChangeText={(text) => setUsuario(text)}
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          secureTextEntry
          keyboardType="default"
        />
      </View>

      <View style={styles.container}>
        <Button theme="confirmar" label="Criar conta" onPress={CriarAccount} />
        <Button theme="cancelar" label="Cancelar" onPress={Cancel} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: "space-evenly",
    alignContent: "center",
    margin: 0,
    alignItems: "center",
    backgroundColor: "#F8F1E5",
  },

  inputContainer: {
    flex: 3,
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

  pickerContainer: {
    width: 320,
    height: 68,
    borderWidth: 4,
    borderColor: "#F9BA32",
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
  },

  text: {
    color: "#2F3131",
    textAlign: "justify",
    textAlignVertical: "center",
    padding: 0,
    margin: 0,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
  },
});
