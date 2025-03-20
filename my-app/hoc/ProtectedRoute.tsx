import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "context/AuthContext";
import { View } from "tamagui";
import { ActivityIndicator } from "react-native";

const ProtectedRoute = ({
  children,
  publicRoutes = [],
}: {
  children: React.ReactNode;
  publicRoutes?: string[];
}) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  const isPublicRoute = publicRoutes.includes(segments[0]);

  useEffect(() => {
    if (!loading && !isPublicRoute && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
