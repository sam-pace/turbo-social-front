import React, { useState, useEffect } from "react";
import { Button, Input, Stack, Text, YStack, Spinner } from "tamagui";
import { useRouter } from "expo-router";
import { themes } from "theme";
import { useAuth } from "app/hooks/useAuth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { isAuthenticated, loading, loginUser } = useAuth();

  // Redireciona automaticamente se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/(tabs)/home");
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <YStack flex={1} justify="center" items="center">
        <Spinner size="large" color={themes.dark.gray1} />
      </YStack>
    );
  }

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    const success = await loginUser(username, password);
    if (!success) {
      alert("Login falhou. Verifique suas credenciais");
    }
  };

  return (
    <YStack flex={1} justify="center" items="center" p={20} display="flex">
      <Stack width="100%" maxW={300} gap={20}>
        <Text fontSize={24} fontWeight="bold">
          Login
        </Text>
        <Input
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button onPress={handleLogin} bg={themes.dark.gray1}>
          Login
        </Button>
      </Stack>
    </YStack>
  );
}
