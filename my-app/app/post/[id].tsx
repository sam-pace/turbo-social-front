import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { Button, YStack, XStack, Input, ScrollView, Text } from "tamagui";
import { useQuery } from "@apollo/client";
import { GET_POST_BY_ID } from "graphql/query";
import { CommentsList, CommentModal } from "components/Comments";
import Avatar from "components/Avatar";
import { useTheme } from "context/ThemeContext";

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
          <XStack alignItems="center" gap={10} m={20}>
            <Avatar size={40} source={post.user.avatarUrl} />
            <Text fontSize={"$8"} fontFamily={"$heading"}>
              @{post.user.username}
            </Text>
          </XStack>
          <Text
            fontSize={"$6"}
            fontFamily={"$body"}
            mb={10}
            ml={20}
            lineBreakMode="middle"
          >
            {post.content}
          </Text>
        </YStack>
        <CommentsList postId={id} />
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
