import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import RNPickerSelect from "react-native-picker-select";
import { api } from "../../services/api";

export default function TaskListScreen() {
  const [tasks, setTasks] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  useEffect(() => {
    getAllTasks();
  }, []);

  const getAllTasks = async () => {
    const token = await SecureStore.getItemAsync("token");
    try {
      const response = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.msg || "Erro ao buscar tarefas"
      );
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const token = await SecureStore.getItemAsync("token");
    try {
      await api.put(
        `/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch {
      Alert.alert("Erro", "Erro ao atualizar status da tarefa.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert("Confirmação", "Tem certeza que deseja deletar esta tarefa?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          const token = await SecureStore.getItemAsync("token");
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

  const filteredTasks = tasks
    .filter((task) => task.status !== "concluido")
    .filter((task) => {
      if (!filterDate) return true;
      const taskDate = task.dueDate?.slice(0, 10);
      return taskDate >= filterDate;
    })
    .filter((task) => {
      if (!filterPriority) return true;
      return task.priority?.toLowerCase() === filterPriority.toLowerCase();
    });

  return (
    <>
      <Stack.Screen options={{ title: "Tarefas em Execução" }} />
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Tarefas em Execução</Text>

        {/* Filtros */}
        <View style={styles.filters}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Data de Entrega</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={filterDate}
              onChangeText={setFilterDate}
            />
            {filterDate ? (
              <TouchableOpacity onPress={() => setFilterDate("")}>
                <Text style={styles.clear}>Limpar</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Prioridade</Text>
            <TextInput
              style={styles.input}
              placeholder="baixa, media, alta"
              value={filterPriority}
              onChangeText={setFilterPriority}
            />
            {filterPriority ? (
              <TouchableOpacity onPress={() => setFilterPriority("")}>
                <Text style={styles.clear}>Limpar</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Lista */}
        {filteredTasks.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.postitContainer}>
                <Image
                  source={require("../../assets/images/postit2.png")}
                  style={styles.postitImage}
                />
                <View style={styles.postitContent}>
                  <Text style={styles.postitTitle}>{item.title}</Text>
                  <Text style={styles.postitDescription}>
                    {item.description}
                  </Text>
                  <Text style={styles.postitMeta}>
                    <Text style={styles.bold}>Equipe:</Text>{" "}
                    {item.taskGroupId?.name || "N/D"}
                  </Text>
                  <Text style={styles.postitMeta}>
                    <Text style={styles.bold}>Entrega:</Text>{" "}
                    {item.dueDate
                      ? new Date(item.dueDate).toLocaleDateString("pt-BR")
                      : "-"}
                  </Text>
                  <Text style={styles.postitMeta}>
                    <Text style={styles.bold}>Prioridade:</Text>{" "}
                    {item.priority || "N/D"}
                  </Text>

                  <View style={styles.statusRow}>
                    <Text>Status: </Text>
                    <View style={styles.selectContainer}>
                      <RNPickerSelect
                        onValueChange={(value) =>
                          handleStatusChange(item._id, value)
                        }
                        value={item.status}
                        items={[
                          { label: "Pendente", value: "pendente" },
                          { label: "Andamento", value: "andamento" },
                          { label: "Concluído", value: "concluido" },
                        ]}
                        style={pickerSelectStyles}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDeleteTask(item._id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteText}>Deletar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef3c7",
    padding: 16,
  },
  logo: {
    width: 120,
    height: 60,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#888",
    marginBottom: 16,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  filterItem: {
    alignItems: "center",
    flex: 1,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f59e0b",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 6,
    textAlign: "center",
    width: "100%",
  },
  clear: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 40,
  },
  postitContainer: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 16,
    position: "relative",
  },
  postitImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    position: "absolute",
  },
  postitContent: {
    padding: 10,
    zIndex: 1,
    flex: 1,
    justifyContent: "center",
  },
  postitTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  postitDescription: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 6,
  },
  postitMeta: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  bold: { fontWeight: "bold" },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  selectContainer: {
    flex: 1,
    height: 20,
    backgroundColor: "#ffbf00",
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
    alignSelf: "center",
  },
  deleteText: {
    color: "white",
    fontSize: 12,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 14,
    paddingVertical: 6,
    color: "#000",
  },
  inputAndroid: {
    fontSize: 14,
    paddingVertical: 6,
    color: "#000",
  },
  placeholder: {
    color: "#333",
  },
};
