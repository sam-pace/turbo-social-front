import { ApolloProvider } from "@apollo/client";
import CustomHeader from "app/components/Header";
import client from "backend/apolloClient";
import TurboCards from "app/components/TurboCards";
import React from "react";
import { View, Text, ScrollView } from "tamagui";
import { themes } from "theme";

export default function TruboMarket() {
  return (
    <ApolloProvider client={client}>
      <View flex={1} width={"100%"} height={"100%"} bg={themes.dark.gray1}>
        <CustomHeader logoType="turbomarket"/>
        <ScrollView overflowX="hidden">
          <View
            width={"100%"}
            flexDirection="row"
            flexWrap="wrap"
            items={"center"}
            justify={"center"}
          >
            <TurboCards />
          </View>
        </ScrollView>
      </View>
    </ApolloProvider>
  );
}
