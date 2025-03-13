import React, { useRef } from "react";
import { View, Text, Button,  } from "tamagui";
import ToggleThemeButton from "./ToggleThemeButton";
import { useRouter } from "expo-router";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { PanResponder, Animated } from "react-native";

const DevTag = () => {
  const router = useRouter();
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          width: "auto",
          height: "auto",
          backgroundColor: "red",
          position: "absolute",
          left: 200,
          top: 200,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: 10,
          borderRadius: 10,
        },
        pan.getLayout(),
      ]}
    >
      <Text>Development Release</Text>
      <ToggleThemeButton />
      <Button iconAfter={ArrowLeft} onPress={() => router.push("/")} />
    </Animated.View>
  );
};

export default DevTag;
