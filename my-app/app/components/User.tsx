import React from "react";
import { Avatar, Input, TamaguiProvider, View, XStack } from "tamagui";
import { themes } from "theme";

export default function UserAvatar() {
  return (
    <TamaguiProvider theme={themes}>
      <View
        shadowColor="black"
        shadowOpacity={0.1}
        style={{
          borderRadius: 10,
          marginTop: 10,
          alignSelf: "center",
          marginBottom: 10
        }}
        gap="$2"

      >
        <XStack
          items="center"
          gap="$4"
          style={{ borderRadius: 15 }}
          width="100%"
          pr={6}
          justify={"space-between"}
        >
          {/* Avatar */}
          <Avatar circular size="$4">
            <Avatar.Image
              accessibilityLabel="Avatar Image"
              src="https://github.com/sam-pace.png"
            />
            <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
          </Avatar>

          {/* Input */}
          <Input
            flex={1}
            size="$4"
            placeholder="O que você está pensando?"
            bg={themes.dark.blue2}
            borderWidth={0}
          />
        </XStack>
      </View>
    </TamaguiProvider>
  );
}
