import { Tabs, useRouter } from "expo-router";
import { Home as HomeIcon, ShoppingCart, Globe } from "@tamagui/lucide-icons";
import { themes } from "theme";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

export default function TabsLayout() {
  return (
    <NavigationContainer theme={themes.dark ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: themes.dark.gray1,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            borderTopWidth: 0,
            shadowColor: "$black",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.6,
            shadowRadius: 5,
            elevation: 5,
          },
          tabBarLabelStyle: {
            display: "none",
          },
          tabBarActiveTintColor: themes.dark
            ? themes.dark.blue9
            : themes.light.blue9,
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
    </NavigationContainer>
  );
}
