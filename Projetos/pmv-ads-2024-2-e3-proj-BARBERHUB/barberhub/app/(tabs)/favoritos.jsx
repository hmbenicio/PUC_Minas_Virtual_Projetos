import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import CalendarViewer from "@/components/CalendarViewer";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function FavoritoScreen() {
  const [appointments, setAppointments] = useState([
    { id: "1", label: "10/12/2024 - 09:00 - Carla Moreira", favorite: false },
    { id: "2", label: "10/12/2024 - 10:30 - João Mendes", favorite: false },
    { id: "3", label: "10/12/2024 - 12:00 - Lucas Pereira", favorite: false },
    { id: "4", label: "10/12/2024 - 13:30 - Marina Costa", favorite: false },
    { id: "5", label: "10/12/2024 - 15:00 - Felipe Santos", favorite: false },
    { id: "6", label: "10/12/2024 - 16:30 - Camila Silva", favorite: false },
    { id: "7", label: "10/12/2024 - 18:00 - Pedro Almeida", favorite: false },
    { id: "8", label: "11/12/2024 - 09:30 - Ana Paula", favorite: false },
    { id: "9", label: "11/12/2024 - 11:00 - Bruno Martins", favorite: false },
    { id: "10", label: "11/12/2024 - 14:00 - Sofia Ribeiro", favorite: false },
  ]);

  const toggleFavorite = (id) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.appointmentItem}>
              <Text style={styles.appointmentText}>{item.label}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                <MaterialIcons
                  name={item.favorite ? "star" : "star-border"}
                  size={24}
                  color={item.favorite ? "#FFD700" : "#808080"}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1E5",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  calendarContainer: {
    width: "100%",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  listContainer: {
    width: "100%",
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  appointmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  appointmentText: {
    fontSize: 16,
    color: "#2F3131",
  },
});
