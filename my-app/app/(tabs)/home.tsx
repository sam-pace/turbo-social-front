import { ApolloProvider, useQuery } from "@apollo/client";
import Post from "components/Posts";
import client from "backend/apolloClient";
import { Redirect, router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button, View, Text, YStack, XStack } from "tamagui";
import { themes } from "theme";
import { ArrowBigLeft, CirclePlus } from "@tamagui/lucide-icons";
import { useAuth } from "context/AuthContext";
import { useTheme } from "context/ThemeContext";
import { ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import ToggleThemeButton from "components/ToggleThemeButton";
import ThubLogo from "components/logos/THubLogo";
import { useState, useCallback } from "react";
import { GET_POSTS } from "graphql/query";
import Avatar from "components/Avatar";
import Curiosities from "lib/curiosities";
import Lightbulb from "components/icons/bulb";
import { UserPanel } from "app/user/panel";
import HideOnScrollWrapper from "components/HideOnScrollWrapper";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const { backgroundColor } = useTheme();
  const { refetch } = useQuery(GET_POSTS, { fetchPolicy: "network-only" });
  const [isUserPanelOpen, setUserPanelOpen] = useState(false);
  const header = (
    <XStack
            flexDirection="row"
            justify={"space-between"}
            mt={80}
            mb={10}
            paddingHorizontal={6}
          >
            <View height={40} width={100} gap={20}>
              <ThubLogo />
            </View>
            <XStack gap={20}>
              <Button
                circular
                chromeless
                onPress={() => {
                  router.push("/post/new");
                }}
              >
                <Button.Icon>
                  <CirclePlus strokeWidth={1} size={40} />
                </Button.Icon>
              </Button >
              <View onPress={() => setUserPanelOpen(true)}>
              <Avatar size={40} />
              </View>
            </XStack>
          </XStack>
  )

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    refetch({ fetchPolicy: "network-only" })
      .finally(() => setIsRefreshing(false));
  }, [refetch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // if (!isAuthenticated) {
  //   router.replace("/");
  // }

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <View flex={1} width={"100%"} height={"100%"} bg={backgroundColor}>
          <HideOnScrollWrapper header={header}>
          <ScrollView
          style={{ top: 120}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            <Curiosities onRefresh={onRefresh} />
            <View position="absolute" t={76} l={16} flex={1}>
              <Lightbulb />
            </View>
            <YStack flex={1} justify={"center"}>
              <Post />
            </YStack>
          </ScrollView>
          </HideOnScrollWrapper>
          
        </View>
        <UserPanel open={isUserPanelOpen} setModalOpen={setUserPanelOpen} />
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
