import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { View, XStack, YStack, Text, Image } from "tamagui";
import { useWindowDimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@apollo/client";
import { GET_TURBOMARKET_ITEM } from "graphql/query";
import { mainColor, themes } from "theme";
import {
  ChevronLeft,
  Car,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  MapPin,
  Factory,
} from "@tamagui/lucide-icons";
import { useTheme } from "context/ThemeContext";

const TurboCardDetails = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [expandDescription, setExpandDescription] = useState(false);
  const { backgroundColor } = useTheme();
  const { id } = useLocalSearchParams();
  const { data, loading, error } = useQuery(GET_TURBOMARKET_ITEM, {
    variables: { id },
  });

  if (loading)
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text fontSize={18}>Carregando...</Text>
      </View>
    );

  if (error)
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text fontSize={18} color="$red10">
          Erro ao carregar os detalhes
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text color="$blue10" fontSize={16} mt={10}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    );

  const item = data?.turboMarket || {};

  return (
    <View flex={1}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 40,
          left: 16,
          zIndex: 10,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: 20,
          padding: 8,
        }}
      >
        <ChevronLeft color="white" size={24} />
      </TouchableOpacity>

      <View style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
        <Image
          style={{ width: width, height: height * 0.6, objectFit: "cover" }}
          source={{
            uri:
              item.imageUrl ||
              "https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg",
          }}
        />
      </View>
      <YStack
        gap={16}
        bg={backgroundColor}
        paddingHorizontal={16}
        paddingBottom={32}
        borderTopLeftRadius={24}
        borderTopRightRadius={24}
        style={{ flex: 1, marginTop: height * 0.5 }}
      >
        <YStack justifyContent="space-between" alignItems="flex-start" mt={16}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "right",
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: themes.dark.blue10,
              textAlign: "right",
            }}
          >
            R$ {item.price}
          </Text>
        </YStack>
        <YStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} maxWidth={width * 1} showsVerticalScrollIndicator>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>Descrição</Text>
            <Text fontSize={16}>
              {expandDescription
                ? item.description
                : `${item.description?.slice(0, 100)}`}
            </Text>
            {item.description?.length > 100 && (
              <TouchableOpacity
                onPress={() => setExpandDescription(!expandDescription)}
                style={{ marginTop: 8 }}
              >
                <Text color="$blue10" fontSize={14} fontWeight="600">
                  {expandDescription ? "Ver menos" : "Ver mais"}
                </Text>
              </TouchableOpacity>
            )}
          </YStack>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <View
              style={{
                backgroundColor,
                borderRadius: 16,
                padding: 16,
                borderStyle: "solid",
                borderWidth: 0.2,
                borderColor: "gray"
              }}
            >
              <DetailRowWithIcon
                icon={<Car size={18} />}
                label={"Modelo"}
                value={`${item.model}`}
              />
              <DetailRowWithIcon
                icon={<Factory size={18} />}
                label={"Marca"}
                value={`${item.brand}`}
              />
              <DetailRowWithIcon
                icon={<Calendar size={18} />}
                label={"Ano de fabricação"}
                value={item.year}
              />
              <DetailRowWithIcon
                icon={<Gauge size={18} />}
                label={"Quilometragem"}
                value={`${item.mileage} km`}
              />
              <DetailRowWithIcon
                icon={<Fuel size={18} />}
                label={"Combustível"}
                value={item.fuelType}
              />
              <DetailRowWithIcon
                icon={<Settings2 size={18} />}
                label={"Transmissão"}
                value={item.transmission}
              />
              <DetailRowWithIcon
                icon={<MapPin size={18} />}
                label={"Localização"}
                value={item.location}
              />
            </View>
          </View>
        </YStack>
      </YStack>
    </View>
  );
};

const DetailRowWithIcon = ({ icon, label, value }) => (
  <XStack
    gap={8}
    alignItems="center"
    justifyContent="space-between"
    width="100%"
    mt={10}
  >
    <XStack alignItems="center" flex={1} gap={10}>
      {icon}
      <Text style={{ fontSize: 16, fontWeight: "bold", }}>
        {label}
      </Text>
    </XStack>
    <Text fontSize={16}>{value}</Text>
  </XStack>
);

export default TurboCardDetails;
