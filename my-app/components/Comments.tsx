import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { XStack, YStack, Spinner, Button, Input, Text } from "tamagui";
import { useMutation, useQuery } from "@apollo/client";
import { GET_COMMENTS_BY_POST } from "graphql/query";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Send } from "@tamagui/lucide-icons";
import { Avatar } from "components/Avatar";
import { useTheme } from "context/ThemeContext";
import { CREATE_COMMENT } from "graphql/mutations";
import { useAuth } from "context/AuthContext";

const CommentItem = ({ comment }) => (
  <XStack
    gap={12}
    padding={10}
    borderBottomWidth={1}
    borderBottomColor="$borderColor"
  >
    <Avatar size={40} source={comment.avatarUrl} />

    <YStack gap={4} width={"90%"}>
      <Text lineBreakMode="tail">@{comment.username}</Text>
      <Text>{comment.content}</Text>
    </YStack>
  </XStack>
);

export const CommentsList = ({ postId }) => {
  const { data, loading, error, refetch } = useQuery(GET_COMMENTS_BY_POST, {
    variables: { postId },
  });

  refetch()

  if (loading)
    return (
      <YStack alignItems="center" padding={20}>
        <Spinner size="large" color="$blue10" />
        <Text marginTop={10}>Carregando comentários...</Text>
      </YStack>
    );
  if (error)
    return (
      <View padding={16} borderRadius={8}>
        <Text color="$red10">Erro ao carregar comentários.</Text>
      </View>
    );

  return (
    <YStack>
      {data?.commentsByPost.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </YStack>
  );
};

export const CommentModal = ({ open, setModalOpen, postId }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const inputRef = useRef<Input>(null);
  const { userId } = useAuth();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const snapPoints = useMemo(() => ["40%", "85%"], []);
  const { backgroundColor } = useTheme();
  const [createComment] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_COMMENTS_BY_POST, variables: { postId } }],
  });

  const handleSheetChange = useCallback((index) => {
    if (index === 1) {
      setTimeout(() => { }, 300);
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, []);

  const handleSnapPress = useCallback((index) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await createComment({
        variables: {
          input: {
            content: comment.trim(),
            createdAt: new Date().toISOString(),
            postId,
            userId,
          },
        },
      });
      setComment("");
      Keyboard.dismiss();
      bottomSheetRef.current?.collapse();
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [open]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={320}
    >
      <BottomSheet
        animateOnMount={true}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backgroundStyle={{ backgroundColor }}
        handleIndicatorStyle={{ backgroundColor: "gray" }}
        style={{ shadowColor: "black", shadowOpacity: 0.1, shadowRadius: 10 }}
        onChange={handleSheetChange}
      >
        <BottomSheetView>
          <YStack padding={16} width="100%">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={16} fontWeight="bold">
                Adicione seu comentário
              </Text>
            </XStack>

            <XStack marginTop={20} items={"center"}>
              <Input
                ref={inputRef}
                value={comment}
                onChangeText={setComment}
                placeholder="Escreva um comentário..."
                clearButtonMode="while-editing"
                onFocus={() => bottomSheetRef.current?.expand()}
                onBlur={() => bottomSheetRef.current?.collapse()}
                width={"100%"}
                maxH={200}
                editable={!loading}
                multiline
              />
              <Button
                onPress={handleCommentSubmit}
                disabled={comment.trim() === ""}
                r={40}
                icon={loading ? <Spinner size="small" /> : <Send size={18} />}
                size={20}
                circular
                chromeless
              />
            </XStack>
          </YStack>
        </BottomSheetView>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
};
