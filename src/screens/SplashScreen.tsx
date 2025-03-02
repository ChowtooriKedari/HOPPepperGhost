import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import Video from "react-native-video";
import { ConfigContext } from "../Navigation/AppNavigator"; // ✅ Import context

const SplashScreen = ({ navigation }) => {
  const config = useContext(ConfigContext); // Get config from AWS
  const [isIntro, setIsIntro] = useState(true);
  const scaleAnim = new Animated.Value(0); // Scale animation for Welcome text
  const fadeAnim = new Animated.Value(0); // Fade-in animation for Welcome text
  const slideAnim = new Animated.Value(0); // Slide animation for "Slide Right" text

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Welcome text scale and fade animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();

    // Slide Right animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Swipe Right Gesture to Transition
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 100) {
        setIsIntro(false); // Move to tutorial video
      }
    },
  });

  const handleSkipTutorial = () => {
    navigation.replace(config.showLogin === true ? "Login" : "Home");
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Background Video (Same for Intro & Tutorial) */}
      <Video
        source={require("../assets/appIntro.mp4")} // Ensure this file exists
        style={styles.backgroundVideo}
        resizeMode="cover"
        repeat
        muted
      />

      {/* Welcome Screen */}
      {isIntro ? (
        <View style={styles.overlay}>
          <Animated.Text
            style={[
              styles.welcomeText,
              {
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            Welcome
          </Animated.Text>
          <Animated.Text
            style={[
              styles.slideRightText,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            Slide Right to Continue →
          </Animated.Text>
        </View>
      ) : (
        // Tutorial Video with Skip Button
        <>
          <Video
            source={require("../assets/tutorial.mp4")} // Ensure this file exists
            style={styles.backgroundVideo}
            resizeMode="cover"
            onEnd={handleSkipTutorial} // Auto-navigate after tutorial ends
          />
          <TouchableOpacity style={styles.skipButton} onPress={handleSkipTutorial}>
            <Text style={styles.skipText}>Skip Tutorial</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#021926",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.9)",
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
    opacity: 0.9,
  },
  slideRightText: {
    position: "absolute",
    bottom: 80,
    fontSize: 18,
    color: "#fff",
    opacity: 0.8,
    fontWeight: "bold",
  },
  skipButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  skipText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default SplashScreen;
