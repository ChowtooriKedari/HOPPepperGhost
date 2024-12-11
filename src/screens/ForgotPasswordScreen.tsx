import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import AWS from "aws-sdk"; // Import AWS SDK

const ForgotPasswordScreen = ({ navigation }) => {
  const [username, setUsername] = useState(""); // Username state
  const [confirmationCode, setConfirmationCode] = useState(""); // Confirmation code state
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [isCodeSent, setIsCodeSent] = useState(false); // Toggle between sending code and resetting password

  // AWS Cognito Configuration
  const clientId = "44or5nn67tqogs1e2lg3tmpdff"; // Replace with your Cognito App Client ID
  const region = "eu-north-1"; // Replace with your AWS region

  AWS.config.update({
    region: region,
  });

  const cognito = new AWS.CognitoIdentityServiceProvider();

  // Handle Forgot Password Request (Send Confirmation Code)
  const handleForgotPassword = async () => {
    try {
      const params = {
        ClientId: clientId,
        Username: username, // Username or email
      };

      await cognito.forgotPassword(params).promise();
      Alert.alert("Confirmation code sent to your email.");
      setIsCodeSent(true); // Switch to reset password view
    } catch (error) {
      //console.error("Forgot Password Error: ", error);
      if (error.code === "UserNotFoundException") {
        Alert.alert("Error", "User not found. Please enter a valid username or email.");
      } else {
        Alert.alert("Request Failed", error.message || JSON.stringify(error));
      }
    }
  };

  // Handle Password Reset
  const handleResetPassword = async () => {
    try {
      const params = {
        ClientId: clientId,
        Username: username,
        ConfirmationCode: confirmationCode, // Code sent to email
        Password: newPassword, // New password to set
      };

      await cognito.confirmForgotPassword(params).promise();
      Alert.alert("Password reset successful. You can now log in with your new password.");
      navigation.navigate("Login"); // Navigate to Login screen
    } catch (error) {
      //console.error("Reset Password Error: ", error);
      Alert.alert("Reset Failed", error.message || JSON.stringify(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isCodeSent ? "Reset Your Password" : "Forgot Password"}
      </Text>
      {!isCodeSent ? (
        <>
          <TextInput
            placeholder="Username or Email"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
            <Text style={styles.buttonText}>Send Confirmation Code</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Confirmation Code"
            value={confirmationCode}
            onChangeText={setConfirmationCode}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f7f9fc",
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
  button: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#6200EE",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ForgotPasswordScreen;
