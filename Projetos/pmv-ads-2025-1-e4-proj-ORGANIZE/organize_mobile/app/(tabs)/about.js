import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from "react-native";

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isDark ? styles.darkBackground : styles.lightBackground,
      ]}
    >
      <Image
        source={require("../../assets/images/Logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>OrgaNize</Text>
      <Text style={styles.subtitle}>Organize seu dia do jeito mais nice!</Text>
      <Text style={styles.subtitle}>Sobre o sistema</Text>

      <View style={styles.card}>
        <Image
          source={require("../../assets/images/postit.png")}
          style={styles.backgroundImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.description}>
            Em um ambiente corporativo, a organização e a gestão eficiente de
            tarefas são essenciais para o sucesso. Muitas empresas enfrentam
            desafios relacionados à desorganização e à má gestão de atividades,
            o que pode comprometer a produtividade e os resultados. Pensando
            nisso, o OrgaNize foi desenvolvido para oferecer uma solução
            eficiente, permitindo que equipes organizem, priorizem e acompanhem
            suas tarefas de forma estruturada, melhorando o fluxo de trabalho e
            a tomada de decisões.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  darkBackground: {
    backgroundColor: "#111827",
  },
  lightBackground: {
    backgroundColor: "#fef3c7",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#64748b",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 20,
    aspectRatio: 1, // OU defina uma altura como height: 300
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.9,
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    zIndex: 1,
    justifyContent: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000",
    textAlign: "justify",
    fontWeight: "500",
  },
});
