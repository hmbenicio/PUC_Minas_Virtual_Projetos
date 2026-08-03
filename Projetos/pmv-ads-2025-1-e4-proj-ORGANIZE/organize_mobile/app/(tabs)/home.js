import {
  Link,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const { width } = useWindowDimensions();

  const accessLogin = async () => {
    router.push("/login/login");
  };

  useEffect(() => {
    AsyncStorage.getItem("isAuthenticated").then((value) => {
      setAuthenticated(value === "true");
    });
  }, []);

  const handleStartClick = () => {
    router.push(authenticated ? "/Login" : "/Login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../../assets/images/Logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>OrgaNize</Text>
      <Text style={styles.subtitle}>Organize seu dia do jeito mais nice!</Text>

      <View style={styles.cardsContainer}>
        {cardData.map((card, index) => (
          <View key={index} style={[styles.card, { width: width * 0.85 }]}>
            <Text style={styles.cardTitle}>{card.title}</Text>

            <View style={styles.postitWrapper}>
              <Image
                source={require("../../assets/images/postit2.png")}
                style={styles.postitImage}
              />
              <View style={styles.postitContent}>
                {card.items.map((item, idx) => (
                  <Text key={idx} style={styles.cardText}>
                    • {item}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={handleStartClick} style={styles.button}>
        <Text onPress={accessLogin} style={styles.buttonText}>
          COMECE AGORA!!
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const cardData = [
  {
    title: "Empresas e Organizações",
    items: [
      "Pequenas, médias e grandes empresas",
      "Startups em crescimento",
      "Equipes remotas e híbridas",
    ],
  },
  {
    title: "Gestores e Líderes",
    items: [
      "Gerentes de projetos",
      "Coordenadores de equipes",
      "Empreendedores buscando eficiência",
    ],
  },
  {
    title: "Profissionais Individuais",
    items: ["Freelancers", "Consultores", "Autônomos focados em produtividade"],
  },
];

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fef3c7", // amarelo claro
    alignItems: "center",
    padding: 20,
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
  cardsContainer: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#cbd5e1",
    marginBottom: 0,
  },
  postitWrapper: {
    width: "90%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  postitImage: {
    width: "115%",
    height: "100%",
    resizeMode: "contain",
    position: "absolute",
  },
  postitContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 2,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#ffbf00",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
