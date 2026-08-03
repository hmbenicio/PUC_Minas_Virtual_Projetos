import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  Platform,
} from "react-native";
import { Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { api } from "../../services/api"; // agora unificado

export default function Task_createScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [teams, setTeams] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    const getAllTeams = async () => {
      try {
        const response = await api.get("/task-groups?created=true");
        setTeams(response.data);
      } catch (error) {
        console.log("Erro ao buscar equipes", error);
        Alert.alert(
          "Erro",
          error.response?.data?.msg || "Erro ao buscar equipes"
        );
      }
    };

    getAllTeams();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("");
    setTeamId("");
    setDate(new Date());
  };

  const createTask = async () => {
    try {
      const response = await api.post("/tasks", {
        title,
        description,
        dueDate: date,
        priority,
        taskGroupId: teamId,
      });

      if (response.status === 201) {
        Alert.alert("Sucesso", "Tarefa criada com sucesso!");
        resetForm();
      }
    } catch (error) {
      console.log("Erro ao criar tarefa", error);
      Alert.alert("Erro", error.response?.data?.msg || "Erro ao criar tarefa");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Criar Tarefa" }} />
      <ImageBackground
        source={require("../../assets/images/postit2.png")}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Criar tarefa</Text>
          <View style={styles.separator} />

          <TextInput
            placeholder="Título"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#333"
            style={styles.input}
          />

          <TextInput
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#333"
            style={[styles.input, { height: 80, textAlignVertical: "top" }]}
            multiline
          />

          <View style={styles.row}>
            <View style={styles.selectContainer}>
              <RNPickerSelect
                onValueChange={(value) => setTeamId(value)}
                placeholder={{ label: "Equipe responsável", value: null }}
                value={teamId}
                items={teams.map((team) => ({
                  label: team.name,
                  value: team._id,
                }))}
                style={pickerSelectStyles}
              />
            </View>

            <View style={styles.selectContainer}>
              <RNPickerSelect
                onValueChange={(value) => setPriority(value)}
                placeholder={{ label: "Prioridade", value: null }}
                value={priority}
                items={[
                  { label: "Baixa", value: "baixa" },
                  { label: "Média", value: "media" },
                  { label: "Alta", value: "alta" },
                ]}
                style={pickerSelectStyles}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {`Data de vencimento: ${date.toLocaleDateString()}`}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                setShowDatePicker(Platform.OS === "ios");
                setDate(currentDate);
              }}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={createTask}>
            <Text style={styles.buttonText}>Criar tarefa</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  form: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginVertical: 8,
    marginHorizontal: "25%",
  },
  input: {
    backgroundColor: "#ffbf00",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  selectContainer: {
    flex: 1,
    backgroundColor: "#ffbf00",
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  dateButton: {
    backgroundColor: "#ffbf00",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  dateButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#ffbf00",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#000",
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    color: "#000",
  },
  placeholder: {
    color: "#333",
  },
};
