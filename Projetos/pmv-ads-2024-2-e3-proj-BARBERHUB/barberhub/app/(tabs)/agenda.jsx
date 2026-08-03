import { Text, View, StyleSheet } from "react-native";
import CalendarViewer from "@/components/CalendarViewer";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

export default function AgendaScreen() {
  const [selectedAppointment, setSelectedAppointment] = useState();

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <CalendarViewer />
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedAppointment}
          onValueChange={(itemValue) => setSelectedAppointment(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Selecione o horário do agendamento" value="" />
          <Picker.Item
            label="10/12/2024 - 09:00 - Carla Moreira"
            value="10-12-2024-09:00-Carla"
          />
          <Picker.Item
            label="10/12/2024 - 10:30 - João Mendes"
            value="10-12-2024-10:30-João"
          />
          <Picker.Item
            label="10/12/2024 - 12:00 - Lucas Pereira"
            value="10-12-2024-12:00-Lucas"
          />
          <Picker.Item
            label="10/12/2024 - 13:30 - Marina Costa"
            value="10-12-2024-13:30-Marina"
          />
          <Picker.Item
            label="10/12/2024 - 15:00 - Felipe Santos"
            value="10-12-2024-15:00-Felipe"
          />
          <Picker.Item
            label="10/12/2024 - 16:30 - Camila Silva"
            value="10-12-2024-16:30-Camila"
          />
          <Picker.Item
            label="10/12/2024 - 18:00 - Pedro Almeida"
            value="10-12-2024-18:00-Pedro"
          />
          <Picker.Item
            label="11/12/2024 - 09:30 - Ana Paula"
            value="11-12-2024-09:30-Ana"
          />
          <Picker.Item
            label="11/12/2024 - 11:00 - Bruno Martins"
            value="11-12-2024-11:00-Bruno"
          />
          <Picker.Item
            label="11/12/2024 - 14:00 - Sofia Ribeiro"
            value="11-12-2024-14:00-Sofia"
          />
        </Picker>
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
  pickerContainer: {
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
  picker: {
    height: 50,
    color: "#2F3131",
  },
  pickerItem: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
