import { SafeAreaView, ScrollView, Text, Image, KeyboardAvoidingView } from "react-native";
import { Button, H1, Input, Label, XStack, YStack } from "tamagui";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "@apollo/client";
import { CREATE_TURBOMARKET } from "graphql/mutations";
import { useAuth } from "context/AuthContext";
import { uploadImage } from "backend/supabase";
import { router } from "expo-router";
import { useTheme } from "context/ThemeContext";
import { useForm } from "react-hook-form";
import { Stack } from "expo-router";
import { mainColor } from "theme";
import { useToast } from "context/ToastContext";

const CreateCardForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      imageUrl: "",
      brand: "",
      model: "",
      year: "",
      mileage: "",
      fuelType: "",
      transmission: "automatic",
      location: "",
    },
    mode: "onChange",
  });

  const isFormValid =
  watch("title") &&
  watch("description") &&
  watch("price") &&
  watch("brand") &&
  watch("year") &&
  watch("model") &&
  watch("mileage") &&
  watch("location") &&
  Object.keys(errors).length === 0

  const [createItem] = useMutation(CREATE_TURBOMARKET);
  const { userId } = useAuth();
  const { backgroundColor } = useTheme();
  const { showToast } = useToast();

  // Observar o valor da imagem para exibição
  const imageUrl = watch("imageUrl");
  const onSubmit = async (data) => {
    try {
      // let finalImageUrl = data.imageUrl;
      // console.warn({ ...data, imageUrl: finalImageUrl, userId });

      // if (finalImageUrl.startsWith("file://")) {
      //   const fileName = finalImageUrl.split("/").pop();
      //   const filePath = `images/${fileName}`;
      //   finalImageUrl = await uploadImage(
      //     finalImageUrl,
      //     "turbo-market-images",
      //     filePath
      //   );
      // }
      
      // await createItem({
      //   variables: {
      //     data: { ...data, imageUrl: finalImageUrl, userId },
      //   },
      // });
      showToast({
        title: "Anúncio criado com sucesso!",
        description: "",
        type: "success",
      })
      // router.push("/(tabs)/turbo-market");
    } catch (error) {
      console.warn("Erro ao criar registro:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1 }}
            >
  <ScrollView showsVerticalScrollIndicator={false}>
    <YStack p="$4" gap={2}>
      <H1>Criar anúncio</H1>

      <Label>Título do anúncio</Label>
      <Input
        {...register("title", {
          required: "O título é obrigatório",
          minLength: { value: 3, message: "Mínimo 3 caracteres" },
        })}
        placeholder="Civic Si 2010"
        onChangeText={(text) => setValue("title", text, { shouldValidate: true })}
      />
      {errors.title && <Text style={{ color: "red" }}>{errors.title.message}</Text>}

      <Label>Descrição</Label>
      <Input
        {...register("description", {
          required: "A descrição é obrigatória",
          minLength: { value: 10, message: "Mínimo 10 caracteres" },
        })}
        placeholder="Detalhes do veículo"
        multiline
        onChangeText={(text) => setValue("description", text, { shouldValidate: true })}
      />
      {errors.description && <Text style={{ color: "red" }}>{errors.description.message}</Text>}

      <XStack gap={20}>
        <YStack flex={1}>
          <Label>Preço</Label>
          <Input
            {...register("price", {
              required: "O preço é obrigatório",
              pattern: { value: /^[0-9]+$/, message: "Apenas números" },
            })}
            placeholder="45000"
            keyboardType="numeric"
            onChangeText={(text) => setValue("price", text, { shouldValidate: true })}
          />
          {errors.price && <Text style={{ color: "red" }}>{errors.price.message}</Text>}
        </YStack>

        <YStack flex={1}>
          <Label>Ano de fabricação</Label>
          <Input
            {...register("year", {
              required: "O ano é obrigatório",
              pattern: { value: /^[0-9]{4}$/, message: "Ano inválido" },
            })}
            placeholder="2010"
            keyboardType="numeric"
            onChangeText={(text) => setValue("year", text, { shouldValidate: true })}
          />
          {errors.year && <Text style={{ color: "red" }}>{errors.year.message}</Text>}
        </YStack>
      </XStack>

      <XStack gap={20}>
        <YStack flex={1}>
          <Label>Marca</Label>
          <Input
            {...register("brand", { required: "A marca é obrigatória" })}
            placeholder="HONDA"
            onChangeText={(text) => setValue("brand", text, { shouldValidate: true })}
          />
          {errors.brand && <Text style={{ color: "red" }}>{errors.brand.message}</Text>}
        </YStack>

        <YStack flex={1}>
          <Label>Modelo</Label>
          <Input
            {...register("model", { required: "O modelo é obrigatório" })}
            placeholder="Civic SI"
            onChangeText={(text) => setValue("model", text, { shouldValidate: true })}
          />
          {errors.model && <Text style={{ color: "red" }}>{errors.model.message}</Text>}
        </YStack>
      </XStack>

      <XStack gap={20}>
        <YStack flex={1}>
          <Label>Quilometragem</Label>
          <Input
            {...register("mileage", {
              required: "A quilometragem é obrigatória",
              pattern: { value: /^[0-9]+$/, message: "Apenas números" },
            })}
            placeholder="150000"
            keyboardType="numeric"
            onChangeText={(text) => setValue("mileage", text, { shouldValidate: true })}
          />
          {errors.mileage && <Text style={{ color: "red" }}>{errors.mileage.message}</Text>}
        </YStack>

        <YStack flex={1}>
          <Label>Localização</Label>
          <Input
            {...register("location", { required: "A localização é obrigatória" })}
            placeholder="Digite a localização"
            onChangeText={(text) => setValue("location", text, { shouldValidate: true })}
          />
          {errors.location && <Text style={{ color: "red" }}>{errors.location.message}</Text>}
        </YStack>
      </XStack>

      <Label>Imagem</Label>
      {imageUrl && <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200, marginBottom: 10 }} />}
      <Button
        onPress={async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            quality: 1,
          });
          if (!result.canceled) setValue("imageUrl", result.assets[0].uri, { shouldValidate: true });
        }}
      >
        Selecionar Imagem
      </Button>
      {errors.imageUrl && <Text style={{ color: "red" }}>{errors.imageUrl.message}</Text>}

      <Button backgroundColor={mainColor} disabled={!isFormValid} opacity={isFormValid ? 1 : 0.5} onPress={handleSubmit(onSubmit)} mt="$4">
        <Text style={{ color: "whitesmoke" }}>Enviar</Text>
      </Button>
    </YStack>
  </ScrollView>
  </KeyboardAvoidingView>
</SafeAreaView>

  );
};

export default CreateCardForm;
