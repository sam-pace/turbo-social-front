import React, { useRef } from 'react';
import { Animated, ScrollView, View, StyleSheet } from 'react-native';
import { useTheme } from 'context/ThemeContext';

const HideOnScrollWrapper = ({ header, children, scrollY   }) => {
  const { backgroundColor } = useTheme()

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.header, { backgroundColor, transform: [{ translateY: headerTranslateY }], opacity: headerOpacity }]}
      >
        {header}
      </Animated.View>
        {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 10,
  },
});

export default HideOnScrollWrapper;
