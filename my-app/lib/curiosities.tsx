// CuriosityComponent.js

import React, { useState, useEffect } from "react";
import { View, Text, Label } from "tamagui";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { RefreshControl } from "react-native";

const CuriosityComponent = ({ onRefresh }) => {
  const [curiosities, setCuriosities] = useState([]);
  const [currentCuriosity, setCurrentCuriosity] = useState(null);
  const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;

  useEffect(() => {
    loadCuriosities();
  }, []);

  const loadCuriosities = async () => {
    const savedCuriosities = await SecureStore.getItemAsync("curiosities");
    if (savedCuriosities) {
      const parsedCuriosities = JSON.parse(savedCuriosities);
      setCuriosities(parsedCuriosities);
      setCurrentCuriosity(parsedCuriosities[0]);
    } else {
      fetchNewCuriosities();
    }
  };

  const fetchNewCuriosities = async () => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      const newCuriosities = data.candidates[0].content.parts[0].text
        .split("\n")
        .map((curiosity) => {
          console.warn(curiosity)
          return curiosity.replace(/^\*\s*/, "").trim();
        })
        .filter(Boolean);

      await SecureStore.setItemAsync(
        "curiosities",
        JSON.stringify(newCuriosities)
      );
      setCuriosities(newCuriosities);
      setCurrentCuriosity(newCuriosities[0]);
    } catch (error) {
      console.error("Erro ao buscar curiosidades:", error);
    }
  };

  const updateCuriosity = () => {
    if (curiosities.length > 0) {
      const nextCuriosityIndex =
        (curiosities.indexOf(currentCuriosity) + 1) % curiosities.length;
      setCurrentCuriosity(curiosities[nextCuriosityIndex]);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Label>
        <Text fontFamily={"$heading"} fontSize={"$6"}>
          Curiosidades
        </Text>
      </Label>
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 16, color: "#333" }}>
          {currentCuriosity ||
            "Aqui você verá curiosidades do mundo automotivo..."}
        </Text>
      </View>
      <RefreshControl
        refreshing={false}
        onRefresh={() => {
          updateCuriosity();
          onRefresh();
        }}
      />
    </View>
  );
};

export default CuriosityComponent;
