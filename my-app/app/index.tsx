import { ApolloProvider } from "@apollo/client";
import client from "backend/apolloClient";
import { Button, KeyboardAvoidingView, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoginScreen from "components/LoginScreen";
import { useTheme } from "context/ThemeContext";
import TurbohubLogo from "components/logos/TurboHubLogo";
import { router, usePathname } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "context/AuthContext";
import AlreadyLoggedModal from "components/AlreadyLoggedModal";
import { BlurView } from "expo-blur";

export default function Index() {
  const { backgroundColor } = useTheme();
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const [open, setModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated && pathname === "/") {
      console.warn("User already logged in. Modal opened.");
      router.push("/(tabs)/home");
    }
  }, [isAuthenticated, loading, pathname]);

  return (
    <ApolloProvider client={client}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"padding"}
        keyboardVerticalOffset={-400}
      >
        <SafeAreaProvider>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor,
              height: "100%",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                position: "absolute",
                height: "100%",
                width: "70%",
                bottom: "30%",
              }}
            >
              <TurbohubLogo />
            </View>
            <LoginScreen />
          </View>
          {/* <AlreadyLoggedModal open={open} setModalOpen={setModalOpen} /> */}
        </SafeAreaProvider>
      </KeyboardAvoidingView>
    </ApolloProvider>
  );
}
