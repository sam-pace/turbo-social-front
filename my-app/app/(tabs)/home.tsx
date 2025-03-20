import { useQuery } from "@apollo/client";
import Post from "components/Posts";
import { router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button, View, YStack, XStack } from "tamagui";
import { CirclePlus } from "@tamagui/lucide-icons";
import { useAuth } from "context/AuthContext";
import { useTheme } from "context/ThemeContext";
import { ActivityIndicator, Animated, RefreshControl, ScrollView } from "react-native";
import ThubLogo from "components/logos/THubLogo";
import { useState, useCallback, useRef } from "react";
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
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current
  const scrollTop = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 0],
    extrapolate: "clamp",

  });
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
      <SafeAreaProvider>
        <View flex={1} width={"100%"} height={"100%"} bg={backgroundColor}>
          <HideOnScrollWrapper header={header} scrollY={scrollY}
            >
          <Animated.ScrollView
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          style={{ top: scrollTop }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
            
          >
            <Curiosities onRefresh={onRefresh} />
            <View position="absolute" t={76} l={16} flex={1}>
              <Lightbulb />
            </View>
            <YStack flex={1} justify={"center"}>
              <Post />
            </YStack>
          </Animated.ScrollView>
          </HideOnScrollWrapper>
          
        </View>
        <UserPanel open={isUserPanelOpen} setModalOpen={setUserPanelOpen} />
      </SafeAreaProvider>
  );
}
