// RootLayout.tsx
import "../tamagui-web.css";
import { useEffect, useState } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { Provider } from "./Provider";
import { TamaguiProvider, Theme } from "tamagui";
import { AuthProvider } from "context/AuthContext";
import { ApolloProvider } from "@apollo/client";
import client from "backend/apolloClient";
import { Oxanium_700Bold } from "@expo-google-fonts/oxanium";
import { Kanit_400Regular } from "@expo-google-fonts/kanit";
import config from "tamagui.config";
import { ThemeProvider, useTheme } from "context/ThemeContext";
import DevTag from "../components/DevTag";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ProtectedRoute from "hoc/ProtectedRoute";
import { ToastProvider } from "context/ToastContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(stack)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    Oxanium_700Bold,
    Kanit_400Regular,
  });

  useEffect(() => {
    if (interLoaded || interError) {
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <TamaguiProvider config={config}>
        <ThemeProvider>
          <Providers>
            <RootLayoutNav />
            {/* <DevTag /> */}
          </Providers>
        </ThemeProvider>
      </TamaguiProvider>
    </ApolloProvider>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>;
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { theme } = useTheme();
  const publicRoutes = ["index", "user/new",];

  return (
    <AuthProvider>
      <Theme name={theme}>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />

        <GestureHandlerRootView style={{ flex: 1 }}>
          <ToastProvider>
          <ProtectedRoute publicRoutes={publicRoutes}>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                  presentation: "fullScreenModal",
                  animation: "simple_push",
                  gestureEnabled: true,
                  gestureDirection: "horizontal",
                }}
              />

              <Stack.Screen
                name="user/new"
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animation: "simple_push",
                  gestureEnabled: true,
                  gestureDirection: "vertical",
                }}
              />

              <Stack.Screen
                name="card/[id]"
                options={{
                  headerShown: false,
                  presentation: "formSheet",
                  animation: "simple_push",
                  gestureEnabled: true,
                  gestureDirection: "horizontal",
                }}
              />

              <Stack.Screen
                name="card/new"
                options={{
                  headerShown: false,
                  presentation: "card",
                  animation: "slide_from_right",
                  gestureEnabled: true,
                  gestureDirection: "horizontal",
                }}
              />

              <Stack.Screen
                name="post/[id]"
                options={{
                  sheetExpandsWhenScrolledToEdge: true,
                  headerShown: false,
                  presentation: "formSheet",
                  animation: "slide_from_bottom",
                  gestureEnabled: true,
                  gestureDirection: "horizontal",
                }}
              />

              <Stack.Screen
                name="post/new"
                options={{
                  sheetExpandsWhenScrolledToEdge: true,
                  headerShown: false,
                  presentation: "formSheet",
                  animation: "slide_from_bottom",
                  gestureEnabled: true,
                  gestureDirection: "horizontal",
                }}
              />
            </Stack>

          </ProtectedRoute>
          </ToastProvider>
        </GestureHandlerRootView>
      </Theme>
    </AuthProvider>
  );
}
