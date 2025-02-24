import { useQuery } from "@apollo/client";
import { GET_TURBOMARKET } from "graphql/query";
import {
  Card,
  CardProps,
  TamaguiProvider,
  View,
  XStack,
  Image,
  Text,
  Button,
  CardHeader,
} from "tamagui";
import { themes } from "theme";
import { ArrowDownRight } from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";

const formatPrice = (price: number) => {
  if (price >= 1000) {
    return (price / 1000).toFixed(0) + "k";
  }
  return price.toString();
};

export default function TurboCards(props: CardProps) {
  const { data, loading, error, refetch } = useQuery(GET_TURBOMARKET);
  refetch();

  if (loading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro: {error.message}</Text>;

  console.warn("turbo-market", data);

  const items = data?.turboMarketAll || [];

  return (
    <TamaguiProvider theme={themes} {...props}>
      <XStack flexWrap="wrap" gap={2} justify={"center"}>
        {items.map((item) => (
          <Card key={item.id} width="48%" height="80%" bg={themes.dark.gray1}>
            <Card.Header position="absolute" bg="rgba(0,0,0,0.6)">
              <Text fontWeight="bold" fontSize={"$2"}>
                {item.username || "user"}
              </Text>

            </Card.Header>
            <Card.Background>
              <Image
                objectFit="cover"
                source={{
                  width: "100%",
                  height: 300,
                  uri:
                    item.imageUrl ||
                    "https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg",
                }}
              />
            </Card.Background>
            <Card.Footer height="60%">
              <LinearGradient
                width="100%"
                bg={themes.dark.gray3}
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="flex-start"
                colors={["rgba(0,0,0,0)", themes.dark.gray1]}
                locations={[0, 0.8]}
                padding={10}
                borderBottomLeftRadius={"$4"}
                borderBottomRightRadius={"$4"}
              >
                <View height={"60%"} marginTop="auto">
                  <Text fontWeight="bold">{item.title}</Text>
                  <Text fontWeight="300" fontSize={"$1"}>
                    {item.description}
                  </Text>
                  <XStack
                    px={4}
                    py={3}
                    gap={5}
                    alignItems="center"
                    justifyContent="space-between"
                    width={"100%"}
                    marginTop="auto"
                  >
                    <Text color="$blue10" fontWeight="bold">
                      R$ {formatPrice(item.price)}
                    </Text>
                    <Button
                      size={"$2"}
                      variant="outlined"
                      iconAfter={ArrowDownRight}
                    >
                      Ver mais
                    </Button>
                  </XStack>
                </View>
              </LinearGradient>
            </Card.Footer>
          </Card>
        ))}
      </XStack>
    </TamaguiProvider>
  );
}
