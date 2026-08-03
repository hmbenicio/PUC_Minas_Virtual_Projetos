import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { api } from "../../services/api"; // instância axios com interceptor configurado
import { Stack } from "expo-router";
import { Picker } from "@react-native-picker/picker";

export default function TeamsScreen() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca as equipes do backend
  const fetchTeams = async () => {
    try {
      const response = await api.get("/task-groups?created=true");
      setTeams(response.data);
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.msg || "Erro ao buscar equipes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Atualiza membros da equipe no backend
  const handleUpdateMembers = async (teamId, members) => {
    try {
      await api.post(`/task-groups/${teamId}/members`, { members });
      Alert.alert("Sucesso", "Membros atualizados com sucesso!");
      fetchTeams(); // Atualiza a lista após salvar
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.msg || "Erro ao atualizar membros"
      );
    }
  };

  // Deleta a equipe
  const handleDeleteTeam = (teamId) => {
    Alert.alert("Confirmação", "Deseja deletar esta equipe?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/task-groups/${teamId}`);
            setTeams((prev) => prev.filter((team) => team._id !== teamId));
          } catch (error) {
            Alert.alert(
              "Erro",
              error.response?.data?.msg || "Erro ao deletar equipe"
            );
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffaa00" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Equipes" }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Equipes</Text>
        <Text style={styles.subheader}>Adicione integrantes à sua equipe</Text>

        {teams.map((team) => (
          <View key={team._id} style={styles.teamCard}>
            <Text style={styles.teamName}>{team.name}</Text>

            {(team.members || []).map((member, index) => (
              <View key={index} style={styles.memberRow}>
                <TextInput
                  value={member.name}
                  onChangeText={(text) => {
                    const updated = [...(team.members || [])];
                    updated[index] = { ...updated[index], name: text };
                    setTeams((prev) =>
                      prev.map((t) =>
                        t._id === team._id ? { ...t, members: updated } : t
                      )
                    );
                  }}
                  placeholder={`Integrante ${index + 1}`}
                  style={styles.input}
                />

                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={member.role}
                    onValueChange={(role) => {
                      const updated = [...(team.members || [])];
                      updated[index] = { ...updated[index], role };
                      setTeams((prev) =>
                        prev.map((t) =>
                          t._id === team._id ? { ...t, members: updated } : t
                        )
                      );
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Observador" value="viewer" />
                    <Picker.Item label="Editor" value="editor" />
                    <Picker.Item label="Admin" value="admin" />
                  </Picker>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    const updated = (team.members || []).filter(
                      (_, i) => i !== index
                    );
                    setTeams((prev) =>
                      prev.map((t) =>
                        t._id === team._id ? { ...t, members: updated } : t
                      )
                    );
                  }}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              onPress={() =>
                setTeams((prev) =>
                  prev.map((t) =>
                    t._id === team._id
                      ? {
                          ...t,
                          members: [
                            ...(t.members || []),
                            { name: "", role: "viewer" },
                          ],
                        }
                      : t
                  )
                )
              }
              style={styles.addButton}
            >
              <Text style={styles.buttonText}>+ Adicionar Integrante</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleUpdateMembers(team._id, team.members)}
              style={styles.saveButton}
            >
              <Text style={styles.buttonText}>Salvar Integrantes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeleteTeam(team._id)}
              style={styles.deleteButton}
            >
              <Text style={styles.buttonText}>Deletar Equipe</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fef3c7",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff8dc",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  subheader: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  teamCard: {
    backgroundColor: "#fffbe6",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  teamName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  memberRow: {
    flexDirection: "column",
    marginBottom: 10,
    backgroundColor: "#fef9c3",
    padding: 10,
    borderRadius: 8,
  },
  input: {
    backgroundColor: "#fff",
    padding: 8,
    marginBottom: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 5,
    overflow: "hidden",
  },
  picker: {
    height: 40,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#fde047",
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
  },
  saveButton: {
    backgroundColor: "#facc15",
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: "#f87171",
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
  },
  removeButton: {
    backgroundColor: "#fecaca",
    padding: 6,
    borderRadius: 4,
    alignSelf: "flex-end",
  },
  buttonText: {
    textAlign: "center",
    color: "#000",
    fontWeight: "600",
  },
  removeButtonText: {
    color: "#b91c1c",
    fontSize: 12,
    textAlign: "center",
  },
});
