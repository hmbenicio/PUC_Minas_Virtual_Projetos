import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

export default function MapaScreen() {
  const [selectedService, setSelectedService] = useState();
  return (
    <View>
      <Picker
        style={styles.pickerContainer}
        selectedValue={selectedService}
        onValueChange={(itemValue, itemIndex) => setSelectedService(itemValue)}
      >
        <Picker.Item label="Selecione o endereço" value="" />
        <Picker.Item label="Barbeiro" value="barberiro" />
        <Picker.Item label="Barbearia" value="barberaria" />
      </Picker>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -19.92305697937307,
          longitude: -43.99437087259795,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: -19.92305697937307,
            longitude: -43.99437087259795,
          }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    marginBottom: 1,
    borderWidth: 4,
    borderColor: "#F9BA32",
    justifyContent: "center",
  },

  pickerContainer: {
    width: "100%",
    height: 68,
    marginBottom: 1,
    borderWidth: 3,
    borderColor: "#F9BA32",
    backgroundColor: "#F8F1E5",
    justifyContent: "center",
  },
});
