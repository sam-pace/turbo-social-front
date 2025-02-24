import { ApolloProvider } from "@apollo/client";
import CustomHeader from "app/components/Header";
import client from "backend/apolloClient";
import { View, ScrollView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider, Text } from "tamagui";
import { themes } from "theme";
import LoginScreen from "./components/LoginScreen";

export default function Index() {
  return (
    <ApolloProvider client={client}>
      <TamaguiProvider theme={themes}>
        <SafeAreaProvider>
          <View
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              backgroundColor: themes.dark.gray1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ScrollView>
              <View flex={1} justify="center" items="center">
                <LoginScreen />
              </View>
            </ScrollView>
          </View>
        </SafeAreaProvider>
      </TamaguiProvider>
    </ApolloProvider>
  );
}
