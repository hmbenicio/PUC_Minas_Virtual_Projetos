import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTheme, useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import MultiSelect from "react-native-multiple-select";
import { api } from "../../services/api"; // ajuste para seu caminho local
import { Button } from "react-native-paper";
import { Stack } from "expo-router";

export default function TaskAssignment() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [openPriority, setOpenPriority] = useState({});
  const [openStatus, setOpenStatus] = useState({});

  // IMPORTANTE: Troque pelo token real ou use AsyncStorage/context para pegar dinamicamente
  const token = "<SEU_TOKEN>";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, teamsRes] = await Promise.all([
          api.get("/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/task-groups?created=true", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setTasks(tasksRes.data);
        setTeams(teamsRes.data);
      } catch (error) {
        Alert.alert("Erro", "Erro ao buscar tarefas ou equipes.");
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (taskId, selectedItems) => {
    setSelectedOptions((prev) => ({ ...prev, [taskId]: selectedItems }));
  };

  const updateField = async (taskId, field, value) => {
    try {
      await api.put(
        `/tasks/${taskId}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, [field]: value } : task
        )
      );
    } catch {
      Alert.alert("Erro", `Erro ao atualizar ${field}.`);
    }
  };

  const handleDelete = async (taskId) => {
    Alert.alert("Confirmação", "Deseja realmente excluir esta tarefa?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        onPress: async () => {
          try {
            await api.delete(`/tasks/${taskId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setTasks((prev) => prev.filter((task) => task._id !== taskId));
          } catch {
            Alert.alert("Erro", "Erro ao deletar tarefa.");
          }
        },
      },
    ]);
  };

  const assignTeam = (taskId) => {
    const selected = selectedOptions[taskId];
    if (!selected || selected.length === 0) {
      Alert.alert("Atenção", "Selecione ao menos uma equipe.");
      return;
    }
    console.log("Atribuir", taskId, "para", selected);
    // Aqui você pode chamar sua API de atribuição
  };

  const renderTask = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image
          source={require("../../assets/images/postit2.png")}
          style={styles.backgroundImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

          <MultiSelect
            items={teams.map((t) => ({ id: t.name, name: t.name }))}
            uniqueKey="id"
            onSelectedItemsChange={(selected) =>
              handleSelectChange(item._id, selected)
            }
            selectedItems={selectedOptions[item._id] || []}
            selectText="Atribuir Equipes"
            searchInputPlaceholderText="Buscar equipe..."
            tagRemoveIconColor="#000"
            tagBorderColor="#000"
            tagTextColor="#000"
            selectedItemTextColor="#000"
            selectedItemIconColor="#000"
            itemTextColor="#000"
            displayKey="name"
            submitButtonText="Selecionar"
            styleMainWrapper={{ marginBottom: 10 }}
          />

          <DropDownPicker
            open={openPriority[item._id]}
            value={item.priority}
            items={[
              { label: "Alta", value: "Alta" },
              { label: "Média", value: "Média" },
              { label: "Baixa", value: "Baixa" },
            ]}
            setOpen={(o) =>
              setOpenPriority((prev) => ({ ...prev, [item._id]: o }))
            }
            setValue={(val) => updateField(item._id, "priority", val())}
            placeholder="Prioridade"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          <DropDownPicker
            open={openStatus[item._id]}
            value={item.status}
            items={[
              { label: "Pendente", value: "pendente" },
              { label: "Andamento", value: "andamento" },
              { label: "Concluído", value: "concluido" },
            ]}
            setOpen={(o) =>
              setOpenStatus((prev) => ({ ...prev, [item._id]: o }))
            }
            setValue={(val) => updateField(item._id, "status", val())}
            placeholder="Status"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          <View style={styles.buttonGroup}>
            <Button mode="contained" onPress={() => assignTeam(item._id)}>
              Atribuir
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("TaskEdit", { id: item._id })}
            >
              Editar
            </Button>
            <Button mode="outlined" onPress={() => handleDelete(item._id)}>
              Deletar
            </Button>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "Atribuição de Tarefas" }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.header}>Atribuição de Tarefas</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={renderTask}
          contentContainerStyle={styles.list}
          scrollEnabled={false}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fef3c7", // fundo amarelo claro
    minHeight: "100%",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: "contain",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#444",
  },
  list: {
    width: "100%",
  },
  card: {
    marginBottom: 20,
    width: "100%",
    aspectRatio: 1,
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fdf5a6",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#333",
    marginVertical: 4,
  },
  dropdown: {
    marginTop: 8,
    borderColor: "#ccc",
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});
