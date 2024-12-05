import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet } from "react-native";

const AnimatedScrollView = ({
  children,
  duration = 500, // Default animation duration
  style,
}) => {
  const scrollViewRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.measure((_, __, ___, contentHeight) => {
        Animated.timing(scrollY, {
          toValue: contentHeight,
          duration,
          useNativeDriver: true,
        }).start(() => {
          scrollViewRef.current.scrollTo({
            y: contentHeight,
            animated: false, // Animation handled manually
          });
        });
      });
    }
  }, [children]); // Re-run when children change

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      style={[styles.scrollView, style]}
      onContentSizeChange={() => {
        scrollViewRef.current?.measure((_, __, ___, contentHeight) => {
          Animated.timing(scrollY, {
            toValue: contentHeight,
            duration,
            useNativeDriver: true,
          }).start(() => {
            scrollViewRef.current.scrollTo({
              y: contentHeight,
              animated: false,
            });
          });
        });
      }}
    >
      {children}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

export default AnimatedScrollView;
