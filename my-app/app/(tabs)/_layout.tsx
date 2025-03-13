import { Tabs } from "expo-router";
import { Home as HomeIcon, ShoppingCart, Globe } from "@tamagui/lucide-icons";
import { themes, mainColor } from "theme";
import { useTheme } from "context/ThemeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TabsLayout() {
  const { backgroundColor } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: backgroundColor,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            borderTopWidth: 0,
            shadowColor: "$black",
            shadowOffset: { width: 0, height: 0.1 },
            elevation: 0.2,
          },
          tabBarActiveTintColor: themes.dark ? mainColor : mainColor,
          tabBarInactiveTintColor: themes.dark ? "#888" : "#888",
          tabBarItemStyle: {
            alignSelf: "center",
            paddingTop: 10,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="turbo-market"
          options={{
            tabBarIcon: ({ color }) => <ShoppingCart color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: ({ color }) => <Globe color={color} size={24} />,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
