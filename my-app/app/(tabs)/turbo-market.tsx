import { ApolloProvider } from "@apollo/client";
import client from "backend/apolloClient";
import TurboCards from "components/TurboCards";
import { View, ScrollView, Button, XStack } from "tamagui";
import { CirclePlus } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import TMarketLogo from "components/logos/TMarketLogo";
import ToggleThemeButton from "components/ToggleThemeButton";
import { useTheme } from "context/ThemeContext";
import Avatar from "components/Avatar";

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
          mt={80}
          mb={10}
          position="sticky"
        >
          <View height={40} width={180} gap={20}>
            <TMarketLogo />
          </View>
          <XStack gap={20}>
            <Button
              circular
              chromeless
              onPress={() => {
                router.push("/card/new");
              }}
            >
              <Button.Icon>
                <CirclePlus strokeWidth={1} size={40} />
              </Button.Icon>
            </Button>
            <Avatar size={40} />
          </XStack>

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
