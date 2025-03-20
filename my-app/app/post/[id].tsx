import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { Button, YStack, XStack, Input, ScrollView, Text, Label } from "tamagui";
import { useQuery } from "@apollo/client";
import { GET_POST_BY_ID } from "graphql/query";
import { CommentsList, CommentModal } from "components/Comments";
import Avatar from "components/Avatar";
import { useTheme } from "context/ThemeContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export default function PostDetail() {
  const { id, openComments } = useLocalSearchParams();
  const [isSheetOpen, setSheetOpen] = useState(openComments === "true");
  const { backgroundColor } = useTheme();
  const [sheet, setSheet] = useState(0);

  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { id },
  });

  console.warn("id", id);

  useEffect(() => {
    if (openComments === "true") {
      setSheetOpen(true);
      setSheet(1);
    }
  }, [openComments]);
console.warn(error)
  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Erro ao carregar post.</Text>;

  const post = data?.post;

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: 800,
        backgroundColor,
        position: 'absolute'
      }}
    >
      <ScrollView p={20}>
        <YStack>
          <XStack alignItems="center" gap={10} p={6}>
            <Avatar size={46} source={post.user.avatarUrl} />
            <Text fontSize={"$8"} fontFamily={"$heading"}>
              @{post.user.username}
            </Text>
          </XStack>
          <Text
            fontFamily={"$body"}
            fontSize={"$4"}
            position="absolute"
            t={40}
            l={64}>
            Postou{" "}
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </Text>

          <Text
            fontSize={"$6"}
            fontFamily={"$body"}
            mb={10}
            mt={10}
            lineBreakMode="middle"
          >
            {post.content}
          </Text>
        </YStack>
        <Label fontFamily={"$heading"}>
          Comentários
        </Label>
        {post.comments.length >= 1 ? <CommentsList postId={id} /> : <Text items={"center"}>Nenhum comentário por enquanto</Text>}

      </ScrollView>
      {isSheetOpen && (
        <CommentModal
          open={isSheetOpen}
          setModalOpen={setSheetOpen}
          postId={id}
        />
      )}
    </View>
  );
}
