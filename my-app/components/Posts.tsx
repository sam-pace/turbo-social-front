import { useState, useContext } from "react";
import {
  Avatar,
  Button,
  Card,
  Text,
  View,
  XStack,
  YStack,
  Image,
} from "tamagui";
import { Heart, MessageCircle } from "@tamagui/lucide-icons";
import { useQuery, useMutation } from "@apollo/client";
import { ActivityIndicator } from "react-native";
import { LIKE_POST } from "graphql/mutations";
import { GET_POSTS } from "graphql/query";
import { router } from "expo-router";
import { useTheme } from "context/ThemeContext";
import { useAuth } from "context/AuthContext";
import HeartFilled from "components/icons/heartFilled";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export default function Post() {
  const { userId } = useAuth();
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { data, loading, error, refetch } = useQuery(GET_POSTS, {
    variables: { userId },
  });
  const [likePost] = useMutation(LIKE_POST);
  const { backgroundColor } = useTheme();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Erro ao carregar dados</Text>;

  const toggleLike = async (id) => {
    try {
      await likePost({
        variables: {
          updatePost: {
            id,
            userId,
          },
        },
      });
      refetch();
    } catch (err) {
      console.error("Erro ao curtir post:", err);
    }
  };

  return (
    <View width={"100%"}>
      {data.postAll.map((item) => {
        const isCurrentlyLiked = item.isLiked || false;
        return (
          <Card
            key={item.id}
            onPress={() => {
              setSelectedPostId(item.id);
              router.push(`/post/${item.id}`);
            }}
            elevate
            width="100%"
            maxWidth={600}
            alignSelf="center"
            borderRadius={0}
            shadowColor="black"
            shadowOpacity={0.1}
            shadowRadius={8}
            p={6}
            backgroundColor={backgroundColor}
          >
            <YStack gap="$3">
              <XStack items="center" gap="$3">
                <Avatar circular size="$4">
                  <Avatar.Image src={item.user.avatarUrl} />
                  <Avatar.Fallback bg="$blue10" />
                </Avatar>
                <Text fontFamily={"$heading"} fontSize={"$6"}>
                  @{item.user.username}
                </Text>
              </XStack>
              <Text
                fontFamily={"$body"}
                fontSize={"$4"}
                position="absolute"
                t={30}
                l={60}
              >
                Postou{" "}
                {formatDistanceToNow(new Date(item.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </Text>
              <Text p={10} fontSize="$4">
                {item.content}
              </Text>
              <Image
                src={item.imageUrl}
                style={{ width: "auto", height: 300, borderRadius: 12 }}
              />
              <XStack gap={8} justify="flex-end" items="center" p={4}>
                <Button
                  chromeless
                  icon={MessageCircle}
                  scaleIcon={2}
                  borderRadius={8}
                  paddingHorizontal={12}
                  paddingVertical={6}
                  onPress={() => {
                    setSelectedPostId(item.id);
                    router.push(`/post/${item.id}?openComments=true`);
                  }}
                ></Button>
                <Button
                  chromeless
                  icon={isCurrentlyLiked ? <HeartFilled /> : Heart}
                  scaleIcon={2}
                  color={isCurrentlyLiked ? "white" : "$color"}
                  borderRadius={8}
                  paddingHorizontal={12}
                  paddingVertical={6}
                  onPress={() => {
                    toggleLike(item.id);
                    setSelectedPostId(item.id);
                  }}
                ></Button>
              </XStack>
            </YStack>
          </Card>
        );
      })}
    </View>
  );
}
