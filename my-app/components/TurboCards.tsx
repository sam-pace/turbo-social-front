import { useQuery } from "@apollo/client";
import { GET_TURBOMARKET } from "graphql/query";
import {
  Card,
  CardProps,
  View,
  XStack,
  Image,
  Text,
  Button,
  Avatar,
} from "tamagui";
import { themes } from "theme";
import { ArrowDownRight, User } from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const formatPrice = (price: number) => {
  if (price >= 1000) {
    return (price / 1000).toFixed(0) + "k";
  }
  return price.toString();
};

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

export default function TurboCards(props: CardProps) {
  const { data, loading, error, refetch } = useQuery(GET_TURBOMARKET);
  refetch();

  if (loading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro: {error.message}</Text>;

  const items = data?.turboMarketAll || [];
  const isOddCount = items.length % 2 !== 0;

  if (!items.length) {
    return (
      <View style={{
        top: 100,
        alignItems: "center",
      }}>
        <Text fontSize={24} fontFamily={"$heading"}

        >cri cri cri cri... 🦗</Text>
        <Text fontSize={16}>Eita, tá vazio aqui...</Text>
        <Text fontSize={16}>Que tal ser o primeiro a publicar algo?</Text>
      </View>)
  }
  return (
    <XStack
      flexWrap="wrap"
      gap={4}
      justify="center"
      pr={2}
      pl={3}
      pt={6}>
      {items.map((item) => (
        <Card
          key={item.id}
          width="48%"
          aspectRatio={0.8}
          borderRadius={2}

          onPress={() => {
            router.push(`/card/${item.id}`);
          }}
        >
          <Card.Header
            position="absolute"
            width={"auto"}
            height={"10%"}
            bg="rgba(0,0,0,0.4)"
            flexDirection="row"
            justify="flex-start"
            gap={4}
            items="center"
            borderTopLeftRadius={8}
            borderBottomRightRadius={20}
            p={0}
            pr={8}
          >
            <Avatar circular size="$1" p={4}>
              <Avatar.Image
                accessibilityLabel="Avatar Image"
                src={
                  item.user.avatarUrl ||
                  "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
                }
              />
              <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
            </Avatar>
            <Text color={"whitesmoke"} fontWeight={100} p={0}>
              @{item.user.username || "user"}
            </Text>
          </Card.Header>
          <Card.Background>
            <Image
              objectFit="cover"
              style={{
                width: "100%",
                height: "99%",
                borderRadius: 8
              }}
              source={{
                uri:
                  item.imageUrl ||
                  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg",
              }}
            />
          </Card.Background>
          <Card.Footer>
            <LinearGradient
              width="100%"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="flex-start"
              colors={["rgba(0,0,0,0)", themes.dark.gray1]}
              locations={[0, 0.8]}
              padding={10}
              style={{ borderRadius: 8 }}
            >
              <View>
                <Text color={"whitesmoke"} fontWeight="bold">
                  {item.title}
                </Text>
                <Text color={"whitesmoke"} fontSize={10} lineBreakMode="clip">
                  {truncateText(item.description, 50)}
                </Text>
                <XStack
                  px={4}
                  py={3}
                  gap={5}
                  items="center"
                  justify="space-between"
                  width={"100%"}
                >
                  <Text color="white" fontWeight="bold">
                    R$ {formatPrice(item.price)}
                  </Text>
                  <Button
                    size={40}
                    color={"whitesmoke"}
                    variant="outlined"
                    borderWidth={0.5}
                    onPress={() => {
                      router.push(`/card/${item.id}`);
                    }}
                  >
                    Detalhes
                  </Button>
                </XStack>
              </View>
            </LinearGradient>
          </Card.Footer>
        </Card>
      ))}
      {isOddCount && (
        <View width="48%" aspectRatio={0.8} opacity={0} pointerEvents="none" />
      )}
    </XStack>
  );
}
