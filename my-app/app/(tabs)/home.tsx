import { ApolloProvider } from "@apollo/client";
import CustomHeader from "app/components/Header";
import Login from "app/components/LoginScreen";
import Post from "app/components/Posts";
import UserAvatar from "app/components/User";
import { AuthProvider } from "app/context/authContext";
import { useAuth } from "app/hooks/useAuth";
import client from "backend/apolloClient";
import { router, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button, ScrollView, TamaguiProvider, View } from "tamagui";
import { themes } from "theme";
import { ArrowBigLeft } from "@tamagui/lucide-icons";

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <TamaguiProvider theme={themes}>
        <SafeAreaProvider>
          <CustomHeader logoType={"fuelhub"} />
          <View flex={1} width={"100%"} height={"100%"} bg={themes.dark.gray1}>
            <Button
              width={"$0.75"}
              icon={ArrowBigLeft}
              justify={"flex-start"}
              items={"center"}
              onPress={() => router.push("/")}
            ></Button>
            <UserAvatar />
            <ScrollView>
              <View flex={1} justify="center" items="center">
                <Post />
              </View>
            </ScrollView>
          </View>
        </SafeAreaProvider>
      </TamaguiProvider>
    </ApolloProvider>
  );
}
