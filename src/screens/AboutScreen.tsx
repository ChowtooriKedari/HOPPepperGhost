import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AboutScreen = () => {
  return (
    <View style={styles.container}>
    <View style={styles.container}>
    <View style={styles.container}>
  <Text style={styles.aboutText}>
    This app showcases 3D modeling work by student artists from Dartmouth College, highlighting the creative intersections of art, technology, and storytelling. Displayed through a Pepper’s Ghost illusion, these digital creations come to life in a holographic-like form, offering a unique, immersive experience. 
    The installation celebrates experimentation in digital art and reimagines how we engage with virtual sculpture and design.
  </Text>

  <Text style={[styles.aboutText, styles.creditText]}>
    Designed by HOP Fellows @ Dartmouth
  </Text>
</View>

</View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a012a",
    paddingHorizontal: 20,
  },
  aboutText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    maxWidth: 320,
  },
  creditText: {
    marginTop: 20, // adds spacing between the two text blocks
    fontSize: 16,
    fontWeight: "normal", // optional: tone down style if you'd like
  },
});

export default AboutScreen;
