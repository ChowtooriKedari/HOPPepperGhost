import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.aboutText}>This is the About Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a012a",
  },
  aboutText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default AboutScreen;
