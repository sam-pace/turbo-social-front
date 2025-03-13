import React, { useState } from "react";
import {
  Button,
  Input,
  YStack,
  Text,
  View,
  H4,
  XStack,
  Avatar,
  ScrollView,
  Spinner,
} from "tamagui";
import * as ImagePicker from "expo-image-picker";
import { Alert, KeyboardAvoidingView } from "react-native";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "graphql/mutations";
import { Eye, EyeOff, Send } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { uploadImage } from "backend/supabase";
import { useTheme } from "context/ThemeContext";
import { mainColor } from "theme";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateUserForm = () => {
  const [createUser] = useMutation(CREATE_USER);
  const [hidePass, setHidePass] = useState(false);
  const { backgroundColor } = useTheme();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      pwdConfirm: "",
      avatarUrl: "",
    },
    mode: "onChange",
  });

  const password = watch("password");
  const avatarUrl = watch("avatarUrl");
  const avatarFallback =
    "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let finalImageUrl = data.avatarUrl;

      if (finalImageUrl.startsWith("file://")) {
        const fileName = finalImageUrl.split("/").pop();
        const filePath = `images/${fileName}`;
        finalImageUrl = await uploadImage(
          finalImageUrl,
          "avatar-images",
          filePath
        );
      }

      delete data.pwdConfirm;
      await createUser({
        variables: {
          data: { ...data },
        },
      });

      Alert.alert("Sucesso", "Seu usuário foi cadastrado. Agora faça login com os dados informados.");
      router.navigate("/");
    } catch (error) {
      console.warn("Erro", error);
      Alert.alert("Erro", "Não foi possível criar o usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={{ paddingHorizontal: 20, backgroundColor, marginBottom: -40 }}
          keyboardShouldPersistTaps="handled"
        >
          <YStack pt={80} pb={20} justify="center" alignItems="center">
            <H4>Criar conta</H4>
          </YStack>

          <YStack gap={20} flexGrow={1}>
            <View alignItems="center" gap={20}>
              <Avatar circular size={200}>
                <Avatar.Image src={avatarUrl || avatarFallback} />
                <Avatar.Fallback
                  delayMs={600}
                  backgroundImage={avatarFallback}
                />
              </Avatar>
              <Button
                onPress={async () => {
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: "images",
                    allowsEditing: true,
                    quality: 1,
                  });
                  if (!result.canceled)
                    setValue("avatarUrl", result.assets[0].uri, {
                      shouldValidate: true,
                    });
                }}
                opacity={0.5}
              >
                Selecionar Imagem
              </Button>
              {errors.avatarUrl && (
                <Text color="red">{errors.avatarUrl.message}</Text>
              )}
            </View>

            <View>
              <Input
                placeholder="Nome de usuário"
                {...register("username", {
                  required: "O username é obrigatório.",
                  minLength: {
                    value: 3,
                    message:
                      "O nome de usuário deve ter pelo menos 3 caracteres.",
                  },
                })}
                onChangeText={(text) =>
                  setValue("username", text, { shouldValidate: true })
                }
              />
              {errors.username && (
                <Text color="red">{errors.username.message}</Text>
              )}
            </View>

            <View>
              <Input
                placeholder="Email"
                {...register("email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "O email não é válido.",
                  },
                })}
                onChangeText={(text) =>
                  setValue("email", text, { shouldValidate: true })
                }
              />
              {errors.email && <Text color="red">{errors.email.message}</Text>}
            </View>

            <View>
              <XStack alignItems="center" position="relative">
                <Input
                  width="100%"
                  placeholder="Senha"
                  secureTextEntry={!hidePass}
                  {...register("password", {
                    required: "A senha é obrigatória.",
                    minLength: {
                      value: 8,
                      message: "A senha deve ter pelo menos 8 caracteres.",
                    },
                  })}
                  onChangeText={(text) =>
                    setValue("password", text, { shouldValidate: true })
                  }
                />
                <Button
                  onPress={() => setHidePass(!hidePass)}
                  icon={hidePass ? <EyeOff size={18} /> : <Eye size={18} />}
                  position="absolute"
                  right={10}
                  size={20}
                  circular
                  chromeless
                />
              </XStack>
              {errors.password && (
                <Text color="red">{errors.password.message}</Text>
              )}
            </View>

            <View>
              <Input
                placeholder="Confirmar Senha"
                secureTextEntry
                {...register("pwdConfirm", {
                  validate: (value) =>
                    value === password || "As senhas não conferem.",
                })}
                onChangeText={(text) =>
                  setValue("pwdConfirm", text, { shouldValidate: true })
                }
              />
              {errors.pwdConfirm && (
                <Text color="red">{errors.pwdConfirm.message}</Text>
              )}
            </View>

            <YStack pt={20}>
              <Button
                onPress={handleSubmit(onSubmit)}
                bg={mainColor}
                color="white"
                disabled={loading}
              >
                {loading ? <Spinner size="small" /> : "Cadastrar"}
              </Button>
            </YStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateUserForm;
