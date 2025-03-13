import { ApolloProvider } from "@apollo/client";
import client from "backend/apolloClient";
import TurboCards from "components/TurboCards";
import { View, ScrollView, Button, XStack } from "tamagui";
import { CirclePlus } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import TMarketLogo from "components/logos/TMarketLogo";
import ToggleThemeButton from "components/ToggleThemeButton";
import { useTheme } from "context/ThemeContext";

export default function TruboMarket() {
  const { backgroundColor } = useTheme();
  return (
    <ApolloProvider client={client}>
      <View flex={1} bg={backgroundColor}>
        <XStack
          display="flex"
          flexDirection="row"
          justify="space-between"
          items="center"
          paddingHorizontal={6}
          mt={81}
          mb={10}
        >
          <View height={40} width={179} gap={20} t={2}>
            <TMarketLogo />
          </View>
        </XStack>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View paddingHorizontal={5}>
            <TurboCards />
          </View>
        </ScrollView>
      </View>
    </ApolloProvider>
  );
}
