import React, { useState } from "react";
import {
  Button,
  Input,
  Stack,
  Text,
  YStack,
  Spinner,
  Separator,
  View,
  XStack,
} from "tamagui";
import { useRouter } from "expo-router";
import { useAuth } from "context/AuthContext";
import { mainColor } from "theme";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { useToast } from "context/ToastContext";

export default function Login() {
  const [open, setModalOpen] = useState(false);
  const { loading, loginUser } = useAuth();
  const [hidePass, setHidePass] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });


  if (loading) {
    return (
      <YStack flex={1} justify="center" items="center">
        <Spinner size="large" color={"$blue10"} />
      </YStack>
    );
  }

  const onSubmit = async (data) => {
    setModalOpen(false);
    const success = await loginUser(data.username.trim(), data.password);
    console.warn(success)
    if (!success) {
      showToast({
        title: "Falha no login",
        description: "Verifique os campos e tente novamente",
        type: "warning",
      })
    }
  };

  return (
    <YStack flex={1} justify="center" items="center" p={20} display="flex">
      <Stack width="100%" maxW={600} gap={20}>
        <Text fontFamily="$heading" fontSize={24} fontWeight="bold">
          Login
        </Text>

        <Input
          placeholder="Nome de usuário"
          onChangeText={(text) =>
            setValue("username", text, { shouldValidate: true })
          }
          autoCapitalize="none"
          {...register("username", {
            required: "O nome de usuário é obrigatório",
          })}
        />
        {errors.username && (
          <Text style={{ color: "red" }}>{errors.username.message}</Text>
        )}

        <XStack items="center" position="relative">
          <Input
            width={"100%"}
            placeholder="Senha"
            {...register("password", {
              required: "A senha é obrigatória.",
            })}
            onChangeText={(text) =>
              setValue("password", text, { shouldValidate: true })
            }
            secureTextEntry={!hidePass}
          />
          <Button
            onPress={() => setHidePass(!hidePass)}
            icon={hidePass ? <EyeOff size={18} /> : <Eye size={18} />}
            position="absolute"
            r={10}
            size={20}
            circular
            chromeless
          />
        </XStack>
        {errors.password && (
          <Text style={{ color: "red" }}>{errors.password.message}</Text>
        )}

        <Button
          mt={20}
          onPress={handleSubmit(onSubmit)}
          bg={mainColor}
          color={"whitesmoke"}
        >
          {loading ? <Spinner size="small" /> : "Entrar"}
        </Button>

        <Separator m={10} />
        <View flexDirection="row" justify={"flex-end"} items={"center"} m={6}>
          <Text>
            Ainda não tem uma conta? {" "}
          </Text>
          <Text onPress={() => {
            router.push("/user/new")

          }}
            color={mainColor}
            dataDetectorType="link"
            textDecorationLine="underline">
            Cadastre-se agora.
          </Text>
        </View>
      </Stack>
    </YStack>
  );
}
