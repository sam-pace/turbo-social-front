import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView, TamaguiProvider } from "tamagui";
import TurboCardDetails from "components/TurboCardDetailed";
import { ApolloProvider } from "@apollo/client";
import client from "backend/apolloClient";

export default function CardDetails() {
  return (
    <ApolloProvider client={client}>
      <TamaguiProvider>
        <SafeAreaProvider>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TurboCardDetails />
          </ScrollView>
        </SafeAreaProvider>
      </TamaguiProvider>
    </ApolloProvider>
  );
}
