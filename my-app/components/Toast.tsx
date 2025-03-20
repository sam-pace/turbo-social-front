import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { View, Text, } from "tamagui"
import { CheckCircle, XCircle, CircleAlert, Info } from "@tamagui/lucide-icons"; 
import { useTheme } from "context/ThemeContext";

const ICONS = {
  success: <CheckCircle size={24} />,
  error: <XCircle size={24} />,
  warning: <CircleAlert size={24} />,
  info: <Info size={24} />,
};

const BORDER = {
  success: "green",
  error: "red",
  warning: "red",
  info: "blue",
};

const Toast = ({ isVisible, title, description, type = "info", onHide }) => {
  const { theme, backgroundColor  } = useTheme()
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
    <Animated.View style={[styles.toast, { backgroundColor, borderColor: BORDER[type], transform: [{ translateY }] }]}>
      {ICONS[type]}
      <View style={styles.textContainer}>
        <Text color={"$color"} style={styles.title}>{title}</Text>
        {description && <Text color={"$color"} style={styles.description}>{description}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    gap: 2,
    borderBottomWidth: 3
  },
  textContainer: {
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
  },
});

export default Toast;
