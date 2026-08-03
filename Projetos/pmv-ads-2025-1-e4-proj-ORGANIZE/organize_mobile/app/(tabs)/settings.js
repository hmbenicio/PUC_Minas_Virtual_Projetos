import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  useColorScheme,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/Feather";

const Tab = createMaterialTopTabNavigator();

function GeraisScreen() {
  const colorScheme = useColorScheme();
  const [tema, setTema] = useState(colorScheme || "system");
  const [notificacoes, setNotificacoes] = useState(true);
  const [alertasSonoros, setAlertasSonoros] = useState(false);
  const [idioma, setIdioma] = useState("pt-BR");
  const [fusoHorario, setFusoHorario] = useState("America/Sao_Paulo");

  return (
    <SafeAreaView style={[styles.container, tema === "light" && styles.bgLight]}>
      <Text style={styles.title}>Configurações do Sistema</Text>
      <Text style={styles.subtitle}>Navegue entre as categorias para ajustar suas preferências.</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="settings" size={20} color="#3b82f6" />
          <Text style={styles.cardTitle}> Parâmetros do Sistema</Text>
        </View>
        <Text style={styles.cardDescription}>Defina idioma, fuso horário, tema e notificações.</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Idioma</Text>
          <RNPickerSelect
            value={idioma}
            onValueChange={setIdioma}
            items={[
              { label: "Português (Brasil)", value: "pt-BR" },
              { label: "Inglês (EUA)", value: "en-US" },
              { label: "Espanhol", value: "es-ES" },
            ]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Fuso Horário</Text>
          <TextInput
            style={styles.input}
            value={fusoHorario}
            onChangeText={setFusoHorario}
            placeholder="Ex: America/Sao_Paulo"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tema</Text>
          <RNPickerSelect
            value={tema}
            onValueChange={setTema}
            items={[
              { label: "Claro", value: "light" },
              { label: "Escuro", value: "dark" },
              { label: "Automático (Sistema)", value: "system" },
            ]}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Exibir notificações no topo</Text>
          <Switch value={notificacoes} onValueChange={setNotificacoes} />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Ativar som para alertas</Text>
          <Switch value={alertasSonoros} onValueChange={setAlertasSonoros} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function ConfiguracoesTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Gerais" component={GeraisScreen} />
      {/* Adicione mais abas conforme necessário */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  bgLight: {
    backgroundColor: "#fef3c7", // equivalente ao amber-100
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    gap: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardDescription: {
    color: "#6b7280",
    fontSize: 12,
    marginBottom: 8,
  },
  section: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 8,
  },
  separator: {
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});