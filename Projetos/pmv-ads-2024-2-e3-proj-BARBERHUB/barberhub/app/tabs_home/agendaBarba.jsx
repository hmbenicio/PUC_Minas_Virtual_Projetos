import { View, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { auth } from "../../assets/firebase.config";
import { Picker } from "@react-native-picker/picker";

import Button from "@/components/ButtonSaveCancel";
import ImageViewer from "@/components/ImageViewerBarba";
import CalendarViewer from "@/components/CalendarViewer";

const PlaceholderImage = require("@/assets/images/HomeBarba.png");

export default function AgendaBarbaScreen() {
  const [selectedImage] = useState(undefined);
  const [selectedService, setSelectedService] = useState();

  const currentUser = auth.currentUser;
  const router = useRouter();

  if (currentUser != null) {
    // Alert.alert("Usuário logado");
  } else {
    Alert.alert("É necessário estar logado para utilizar esse recurso!");
    router.replace("login");
  }

  const ConfimarAgenda = async () => {
    alert("Agendamento confirmado!");
  };
  const Cancel = async () => {
    router.push("(tabs)/");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Estilos de barbas" }} />
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageViewer
            imgSource={PlaceholderImage}
            selectedImage={selectedImage}
          />
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            placeholder="Selecione o tipo de usuário"
            selectedValue={selectedService}
            onValueChange={(itemValue) => setSelectedService(itemValue)}
          >
            <Picker.Item label="Barbeiro" value="barbeiro" />
            <Picker.Item label="Barbearia" value="barbearia" />
          </Picker>
        </View>

        <View style={styles.calendarContainer}>
          <CalendarViewer />
        </View>

        <View style={styles.footerContainer}>
          <Button
            theme="confirmar"
            label="Confirmar"
            onPress={ConfimarAgenda}
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
    // flex: 1,
    padding: 10,
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

  pickerContainer: {
    width: 320,
    height: 68,
    marginBottom: 15,
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

  calendarContainer: {
    width: "70%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderRadius: 18,
    borderColor: "#F9BA32",
  },
});
