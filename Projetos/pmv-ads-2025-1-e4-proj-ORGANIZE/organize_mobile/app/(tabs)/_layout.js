import { Tabs, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity, Text } from "react-native";

export default function TabLayout() {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const value = await AsyncStorage.getItem("isAuthenticated");
      if (value !== "true") {
        router.replace("/login/login"); // Redireciona se não estiver autenticado
      }
      setAuthenticated(value === "true");
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["isAuthenticated", "token", "userData"]);
    setAuthenticated(false);
    router.replace("/(tabs)/home");
  };

  const handleLogin = () => {
    router.push("/login/login");
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      {["home", "menu", "profile", "settings", "about"].map((screenName) => (
        <Tabs.Screen
          key={screenName}
          name={screenName}
          options={{
            title: screenName.charAt(0).toUpperCase() + screenName.slice(1),
            tabBarIcon: ({ color, focused }) => {
              switch (screenName) {
                case "home":
                  return (
                    <Ionicons
                      name={focused ? "home-sharp" : "home-outline"}
                      size={24}
                      color={color}
                    />
                  );
                case "menu":
                  return (
                    <MaterialCommunityIcons
                      name={focused ? "post" : "post-outline"}
                      size={24}
                      color={color}
                    />
                  );
                case "profile":
                  return (
                    <FontAwesome5
                      name={focused ? "user-alt" : "user"}
                      size={24}
                      color={color}
                    />
                  );
                case "settings":
                  return (
                    <Ionicons
                      name={focused ? "settings" : "settings-outline"}
                      size={24}
                      color={color}
                    />
                  );
                case "about":
                  return (
                    <Ionicons
                      name={
                        focused
                          ? "information-circle"
                          : "information-circle-outline"
                      }
                      size={24}
                      color={color}
                    />
                  );
              }
            },
            headerRight: () => (
              <TouchableOpacity
                onPress={authenticated ? handleLogout : handleLogin}
                style={{
                  marginRight: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name={authenticated ? "log-out-outline" : "log-in-outline"}
                  size={24}
                  color="#fff"
                />
                <Text style={{ color: "#fff", marginLeft: 6 }}>
                  {authenticated ? "Sair" : "Entrar"}
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
