import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

const TransientModal = ({ isVisible, message, onHide }) => {
  const translateY = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    if (isVisible) {

      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, 3000);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.modal, { transform: [{ translateY }] }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 400,
    left: 20,
    right: 20,
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TransientModal;
