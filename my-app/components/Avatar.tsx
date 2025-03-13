import { useQuery } from "@apollo/client";
import { useAuth } from "context/AuthContext";
import { GET_USER } from "graphql/query";
import { Avatar as TamaguiAvatar, Text } from "tamagui";

export const Avatar = ({ size }) => {
  const avatarFallback =
    "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png";
  const { userId } = useAuth();
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId,
  });

  if (loading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro ao carregar usuário</Text>;

  const user = data?.user;

  if (!user) return <Text>Nenhum usuário encontrado</Text>;

  return (
    <TamaguiAvatar circular size={size}>
      <TamaguiAvatar.Image
        accessibilityLabel="Avatar Image"
        src={{ uri: user.avatarUrl || avatarFallback }}
      />
    </TamaguiAvatar>
  );
};
export default Avatar;
