import "../tamagui-web.css";

import { useEffect } from "react";
import {
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  View,
} from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { Provider } from "./Provider";
import { TamaguiProvider, useTheme } from "tamagui";
import { AuthProvider, useAuthContext } from "./context/authContext";
import { ApolloProvider } from "@apollo/client";
import client from "backend/apolloClient";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  // const { isAuthenticated, loading } = useAuthContext();
  // // console.warn('autenticated', isAuthenticated)

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }
  // if (!isAuthenticated) {
  //   return ( 
  //     <Redirect href="/(auth)/login" />
  //   );
  // }

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return (
    // <AuthProvider>
      <Providers>
        <RootLayoutNav />
      </Providers>
    // </AuthProvider>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>;
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  return (
    <TamaguiProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="modal"
            options={{
              title: "Tamagui + Expo",
              presentation: "modal",
              animation: "slide_from_right",
              gestureEnabled: true,
              gestureDirection: "horizontal",
              contentStyle: {
                backgroundColor: theme.background.val,
              },
            }}
          />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
