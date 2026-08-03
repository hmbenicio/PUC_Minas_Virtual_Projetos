import { StyleSheet } from "react-native";
import { Image } from "expo-image";

export default function ImageViewerLogo({ imgSource, selectedImage }) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    // flex: 1,
    justifyContent: "center",
    width: 200,
    height: 200,
    borderRadius: 20,
  },
});
