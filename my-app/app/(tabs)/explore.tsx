import { ApolloProvider } from "@apollo/client";
import client from "backend/apolloClient";
import React from "react";
import { View, Text } from "tamagui";

export default function Explore() {
  return (
    <ApolloProvider client={client}>
      <View flex={1} justify="center" items="center">
        <Text fontSize="$6" fontWeight="bold" color={"$blue10"}>

        </Text>
      </View>
    </ApolloProvider>
  );
}
