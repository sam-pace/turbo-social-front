import { useState } from "react";
import { View, ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button, Input, YStack, Text, XStack, TextArea, Spinner } from "tamagui";
import { Image as ImageIcon, Paperclip } from "@tamagui/lucide-icons";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_POST } from "graphql/mutations";
import { useAuth } from "context/AuthContext";
import { useTheme } from "context/ThemeContext";
import { uploadImage } from "backend/supabase";
import TransientModal from "components/Toast";
import { GET_POSTS } from "graphql/query";
import { mainColor } from "theme";
import { useForm } from "react-hook-form";
import { router } from "expo-router";

export default function CreatePost() {
    const { userId } = useAuth();
    const { backgroundColor } = useTheme();
    const [content, setContent] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [visible, setTransientModal] = useState(false);
    const [message, setMessage] = useState("");
    const numberOfLines = content.split('\n').length

    const [createPost, { loading }] = useMutation(CREATE_POST, {
        onCompleted: () => {
            setTransientModal(true);
            setMessage("Sucesso! Seu post foi criado.");
            setContent("");
            setImage(null);
            router.back()
        },
        onError: (error) => {
            console.warn(`Erro: ${error.message}`);
            setTransientModal(true);
        },
    });

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handlePost = async () => {
        if (!content.trim() && !image) {
            setTransientModal(true);
            setMessage("Atenção: O post precisa de texto ou uma imagem.");
            return;
        }

        let finalImageUrl = image;

        if (finalImageUrl?.startsWith("file://")) {
            try {
                setUploading(true);
                const fileName = finalImageUrl.split("/").pop();
                const filePath = `images/${fileName}`;
                finalImageUrl = await uploadImage(finalImageUrl, "post-images", filePath);
            } catch (error) {
                setMessage("Erro: Não foi possível enviar a imagem.");
                setTransientModal(true);
                return;
            } finally {
                setUploading(false);
            }
        }
        try {
            await createPost({
                variables: {
                    createPost: {
                        content,
                        imageUrl: finalImageUrl || "null",
                        userId,
                        likes: 0,
                    },
                },
            });
        } catch (error) {
            console.warn("Erro ao criar post:", error);
            Alert.alert("Erro ao criar post", error.message || "Tente novamente mais tarde.");
        }
    };

    return (
        <View style={{ backgroundColor, minHeight: "100%" }}>
            <YStack gap={10} p={20}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text fontSize={"$8"} fontFamily={"$heading"}>Nova publicação</Text>
                    <Button
                        bg={mainColor}
                        color={"whitesmoke"}
                        disabled={content.trim().length < 3}
                        disabledStyle={{ bg: "gray" }}
                        onPress={() => { handlePost() }}>
                        {loading ? <Spinner size="small" /> : "Postar"}
                    </Button>
                </View>


                <XStack marginTop={20} justify={"flex-end"} >
                    <TextArea
                        value={content}
                        onChangeText={setContent}
                        width={"100%"}
                        maxH={200}
                        pl={20}
                        editable={!loading}
                        placeholder="O que você está pensando?"
                    >

                    </TextArea>

                    <Button
                        onPress={() => pickImage()}
                        position="absolute"
                        borderRadius={6}
                        transition="linear"
                        transitionDelay="100"
                        m={6}
                        r={2}
                        b={1}
                        icon={loading ? <Spinner size="small" /> : <ImageIcon size={18} />}
                        size={20}
                        p={16}
                        alignSelf={numberOfLines > 1 ? "flex-end" : "center"}
                    />

                </XStack>
                {image && (
                    <View style={{ display: "flex", position: "relative" }}>

                        <Image
                            source={{ uri: image }}
                            style={{ width: 120, height: 120, marginBottom: 10, borderRadius: 12 }}
                        />
                        <View style={{ bottom: 120, left: 90, backgroundColor: "gray", width: 24, height: 24, borderRadius: 6 }}>
                            <Paperclip color={"whitesmoke"} m={5} size={16} />
                        </View>
                    </View>

                )}
            </YStack>

        </View >
    );
}
function watch(arg0: string) {
    throw new Error("Function not implemented.");
}

