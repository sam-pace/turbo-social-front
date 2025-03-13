import { ApolloProvider, useQuery } from "@apollo/client";
import Post from "components/Posts";
import client from "backend/apolloClient";
import { Redirect, router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button, Input, Label, ScrollView, View, Text, YStack } from "tamagui";
import { themes } from "theme";
import { ArrowBigLeft } from "@tamagui/lucide-icons";
import { useAuth } from "context/AuthContext";
import { useTheme } from "context/ThemeContext";
import { ActivityIndicator, RefreshControl } from "react-native";
import ToggleThemeButton from "components/ToggleThemeButton";
import ThubLogo from "components/logos/THubLogo";
import { useState, useCallback } from "react";
import { GET_POSTS } from "graphql/query";
import Avatar from "components/Avatar";
import Curiosities from "lib/curiosities";
import Lightbulb from "components/icons/bulb";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const { backgroundColor } = useTheme();
  const { refetch } = useQuery(GET_POSTS);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    refetch();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <View flex={1} width={"100%"} height={"100%"} bg={backgroundColor}>
          <View
            flexDirection="row"
            justify={"space-between"}
            mt={80}
            mb={10}
            paddingHorizontal={6}
          >
            <View height={40} width={100} gap={20}>
              <ThubLogo />
            </View>
            <Avatar size={50} />
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            <Curiosities onRefresh={onRefresh} />
            <View position="absolute" t={76} l={16} flex={1}>
              <Lightbulb />
            </View>
            <View flex={1} justify="center" items="center">
              <Post />
            </View>
          </ScrollView>
        </View>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
