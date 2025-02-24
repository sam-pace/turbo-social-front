import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Input,
  Sheet,
  TamaguiProvider,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { Heart, MessageCircle } from "@tamagui/lucide-icons";
import { themes } from "theme";
import { useQuery, useMutation } from "@apollo/client";
import { ActivityIndicator } from "react-native";
import { LIKE_POST } from "graphql/mutations";
import { GET_POSTS } from "graphql/query";

export default function Post() {
  const [comments, setComments] = useState(1);
  const [open, setOpen] = useState(false);
  const [commentText, setCommentText] = useState("kkk");
  const { data, loading, error, refetch } = useQuery(GET_POSTS);
  const [liked, setLiked] = useState(false);
  const [likePost] = useMutation(LIKE_POST);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Erro ao carregar dados</Text>;

  const toggleLike = async (id, likes) => {
    try {
      await likePost({
        variables: {
          input: {
            id,
            likes: liked ? likes - 1 : likes + 1,
          },
        },
      });
      setLiked(!liked);
      refetch();
    } catch (err) {
      console.error("Erro ao curtir post", err);
    }
  };

  return (
    <>
      <TamaguiProvider theme={themes}>
        {data.postAll.map((item) => (
          <Card
            key={item.id}
            elevate
            bordered
            p="$4"
            width="100%"
            maxWidth={600}
            alignSelf="center"
            bg={themes.dark.gray1}
            borderRadius={0}
            shadowColor="black"
            shadowOpacity={0.1}
            shadowRadius={10}
          >
            <YStack gap="$3">
              {/* Header - Avatar e Nome do Usuário */}
              <XStack items="center" gap="$3">
                <Avatar circular size="$4">
                  <Avatar.Image src="https://github.com/sam-pace.png" />
                  <Avatar.Fallback bg="$blue10" />
                </Avatar>
                <Text fontSize="$5" fontWeight="bold">
                  joazinho
                </Text>
              </XStack>

              {/* Texto da Publicação */}
              <Text fontSize="$4">{item.content}</Text>

              {/* Barra de Ações - Curtir e Comentar */}
              <XStack justify="space-between" items="center">
                {/* Botão de Curtir */}
                <Button
                  chromeless
                  icon={Heart}
                  iconAfter={<Text>{item.likes}</Text>}
                  color={likePost[item.likes.false] ? "red" : "$color"}
                  onPress={() => toggleLike(item.id, item.likes)}
                >
                  Curtir
                </Button>

                {/* Botão de Comentar */}
                <Button
                  chromeless
                  icon={MessageCircle}
                  iconAfter={<Text>{comments}</Text>}
                  onPress={() => setOpen(true)}
                >
                  Comentar
                </Button>
              </XStack>
            </YStack>
          </Card>
        ))}

        {/* Gaveta de Comentários */}
        <Sheet
          modal
          open={open}
          onOpenChange={setOpen}
          snapPoints={[60]}
          dismissOnSnapToBottom
        >
          <Sheet.Frame p="$4" items="center" justify="center">
            <Text fontSize="$5" fontWeight="bold">
              Adicionar Comentário
            </Text>
            <Input
              placeholder="Digite seu comentário..."
              width="100%"
              mt="$4"
              size="$4"
              value={commentText}
              onChangeText={setCommentText}
            />
            <Button mt="$4" onPress={() => alert(`Comentário: ${commentText}`)}>
              Enviar
            </Button>
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </TamaguiProvider>
    </>
  );
}
