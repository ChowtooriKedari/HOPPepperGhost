import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For storing session
import AWS from "aws-sdk"; // Use AWS SDK

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState(""); // Username state
  const [password, setPassword] = useState(""); // Password state
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility

  // AWS Cognito Configuration
  const clientId = "3jcmcoesbkdm2asd364v1q6das"; // Replace with your Cognito App Client ID
  const region = "us-east-1"; // Replace with your AWS Region

  AWS.config.update({
    region: region,
  });

  const cognito = new AWS.CognitoIdentityServiceProvider();

  // Remove back arrow in the header
  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header for a cleaner look
    });
  }, [navigation]);

  // Handle Login
  const handleLogin = async () => {
    try {
      const params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: {
          USERNAME: username, // This can be the "preferred_username" or email
          PASSWORD: password,
        },
      };

      const response = await cognito.initiateAuth(params).promise();

      if (response.AuthenticationResult) {
        const token = response.AuthenticationResult.IdToken; // Extract the token
        await AsyncStorage.setItem("userToken", token); // Save the token in AsyncStorage
        //Alert.alert("Login Successful");
        navigation.replace("Home"); // Navigate to Home screen
      } else {
        Alert.alert("Login Failed", "Authentication failed. Please try again.");
      }
    } catch (error) {
      //console.error("Login Error: ", error);
      Alert.alert("Login Failed", error.message || JSON.stringify(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Peppers Ghost</Text>
      <TextInput
        placeholder="Username or Email"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.showPasswordToggle}
        >
          <Text style={styles.showPasswordText}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.footerText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.footerText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f8",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 50,
    marginVertical: 10,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  showPasswordToggle: {
    paddingHorizontal: 15,
  },
  showPasswordText: {
    color: "#6200EE",
    fontSize: 14,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#6200EE",
    fontSize: 14,
    marginVertical: 5,
  },
});

export default LoginScreen;
