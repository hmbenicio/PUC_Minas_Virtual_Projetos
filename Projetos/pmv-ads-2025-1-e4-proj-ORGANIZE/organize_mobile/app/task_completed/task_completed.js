import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "react-native-paper";
import { api } from "../../services/api"; // ajuste conforme seu projeto
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";

export default function TarefasConcluidasScreen() {
  const [tarefasConcluidas, setTarefasConcluidas] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.get("/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const concluidas = response.data.filter(
          (t) => t.status === "concluido"
        );

        setTarefasConcluidas(concluidas);
      } catch (error) {
        console.error("Erro ao buscar tarefas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const formatarData = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const renderPostit = ({ item }) => (
    <TouchableOpacity
      onPress={() => setModalData(item)}
      style={styles.postitContainer}
    >
      <Image
        source={require("../../assets/images/postit2.png")}
        style={styles.postitImage}
      />
      <View style={styles.postitContent}>
        <Text style={styles.postitTitle}>{item.title || item.titulo}</Text>
        <Text style={styles.postitDescription}>
          {item.description || item.descricao}
        </Text>
        <View style={styles.postitMeta}>
          <Text>
            <Text style={styles.bold}>Responsável: </Text>
            {item.person || item.pessoa}
          </Text>
          <Text>
            <Text style={styles.bold}>Área: </Text>
            {item.area}
          </Text>
          <Text>
            <Text style={styles.bold}>Data: </Text>
            {formatarData(item.dueDate || item.data)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Tarefas Concluídas" }} />
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Tarefas Concluídas</Text>

        {tarefasConcluidas.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhuma tarefa concluída encontrada.
          </Text>
        ) : (
          <FlatList
            data={tarefasConcluidas}
            renderItem={renderPostit}
            keyExtractor={(item) => item._id || Math.random().toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingBottom: 60 }}
          />
        )}

        <Modal
          visible={modalData !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setModalData(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <TouchableOpacity
                  onPress={() => setModalData(null)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {modalData?.title || modalData?.titulo}
                </Text>
                <Text style={styles.modalText}>
                  {modalData?.description || modalData?.descricao}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Responsável:</Text>{" "}
                  {modalData?.person || modalData?.pessoa}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Área:</Text> {modalData?.area}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Descrição:</Text>{" "}
                  {modalData?.fullDescription || modalData?.descricaoCompleta}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Data de conclusão:</Text>{" "}
                  {formatarData(modalData?.dueDate || modalData?.data)}
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fef3c7",
  },
  logo: { width: 120, height: 60, alignSelf: "center", marginBottom: 10 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#888",
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
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
  },
  bold: { fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1f2937",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 6,
    right: 10,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 28,
    color: "#ccc",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#facc15",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
