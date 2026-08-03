import React, { useEffect, useState } from "react";
import {
  View,
  Text as RNText,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import { PieChart } from "react-native-svg-charts";
import { Text } from "react-native-svg";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { api } from "../../services/api";

export default function ReportScreen() {
  const [total, setTotal] = useState(0);
  const [andamento, setAndamento] = useState(0);
  const [concluidas, setConcluidas] = useState(0);
  const [naoIniciadas, setNaoIniciadas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = "";
      try {
        const response = await api.get("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasks = response.data;
        setTotal(tasks.length);
        setAndamento(tasks.filter((t) => t.status === "andamento").length);
        setConcluidas(tasks.filter((t) => t.status === "concluido").length);
        setNaoIniciadas(tasks.filter((t) => t.status === "pendente").length);
      } catch (error) {
        console.error("Erro ao buscar tarefas", error);
        alert("Erro ao buscar tarefas.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Cálculo de porcentagens para o gráfico
  const calcPercent = (value) =>
    total ? ((value / total) * 100).toFixed(1) + "%" : "0%";

  // Dados para o gráfico
  const data = [
    { key: "Criadas", value: total, color: "#4B5563" },
    { key: "Andamento", value: andamento, color: "#F59E0B" },
    { key: "Concluídas", value: concluidas, color: "#10B981" },
    { key: "Não iniciadas", value: naoIniciadas, color: "#EF4444" },
  ].filter((item) => item.value > 0); // Remove categorias sem dados

  // Dados formatados para PieChart
  const pieData = data.map((item, index) => ({
    value: item.value,
    svg: {
      fill: item.color,
    },
    key: `pie-${index}`,
    arc: { outerRadius: "100%", cornerRadius: 5 },
    label: `${calcPercent(item.value)}`,
  }));

  // Componente para mostrar os labels no gráfico com porcentagem
  const Labels = ({ slices }) =>
    slices.map((slice, index) => {
      const { pieCentroid, data } = slice;
      return (
        <Text
          key={`label-${index}`}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={14}
          fontWeight="bold"
        >
          {data.label}
        </Text>
      );
    });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffbf00" />
        <RNText style={{ marginTop: 10 }}>Carregando dados...</RNText>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Relatórios" }} />
      <ScrollView contentContainerStyle={styles.container}>
        <RNText style={styles.title}>Relatório de Tarefas</RNText>

        <View style={styles.statsContainer}>
          <StatBox
            icon="clipboard-list"
            label="Criadas"
            value={total}
            color="#4B5563"
          />
          <StatBox
            icon="spinner"
            label="Andamento"
            value={andamento}
            color="#F59E0B"
          />
          <StatBox
            icon="check-circle"
            label="Concluídas"
            value={concluidas}
            color="#10B981"
          />
          <StatBox
            icon="pause-circle"
            label="Não iniciadas"
            value={naoIniciadas}
            color="#EF4444"
          />
        </View>

        <View style={styles.chartContainer}>
          <PieChart style={{ height: 220, width: 220 }} data={pieData}>
            <Labels />
          </PieChart>
        </View>
      </ScrollView>
    </>
  );
}

function StatBox({ icon, label, value, color }) {
  return (
    <View style={[styles.box, { borderColor: color }]}>
      <FontAwesome5 name={icon} size={24} color={color} />
      <RNText style={[styles.boxLabel, { color }]}>{label}</RNText>
      <RNText style={styles.boxValue}>{value}</RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    backgroundColor: "#fff8dc",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#64748b",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: 380,
  },
  box: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 16,
    margin: 6,
    backgroundColor: "#fff",
    width: 170,
    alignItems: "center",
  },
  boxLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  boxValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },
  chartContainer: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
});
