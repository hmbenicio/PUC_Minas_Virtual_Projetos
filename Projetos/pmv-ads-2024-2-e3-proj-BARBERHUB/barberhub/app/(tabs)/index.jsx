import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import Button from "@/components/ButtonHome";
import ImageViewer from "@/components/ImageViewerLogo";

const PlaceholderImage = require("@/assets/images/logo.png");

export default function Index() {
  const [selectedImage] = useState(undefined);
  const router = useRouter();

  const accessCorte = async () => {
    router.push("/tabs_home/agendaCortes");
  };
  const accessLimpeza = async () => {
    router.push("/tabs_home/agendaLimpeza");
  };
  const accessBarba = async () => {
    router.push("/tabs_home/agendaBarba");
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer
          imgSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
      </View>
      <View style={styles.footerContainer}>
        <Button
          theme="cortes"
          label="Estilos de cabelos"
          onPress={accessCorte}
        />
        <Button theme="barba" label="Estilos de barbas" onPress={accessBarba} />
        <Button
          theme="limpeza"
          label="Limpeza de pele"
          onPress={accessLimpeza}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1E5",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    padding: 35,
    backgroundColor: "#F8F1E5",
  },
  footerContainer: {
    flex: 1,
    padding: 15,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F8F1E5",
  },
});
