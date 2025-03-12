import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AWS from "aws-sdk";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferredUsername, setPreferredUsername] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const [focusedField, setFocusedField] = useState(""); // Track focused input

  const [usernameConditions, setUsernameConditions] = useState({
    length: false,
    format: false,
  });
  const [preferredUsernameConditions, setPreferredUsernameConditions] =
    useState({
      length: false,
      format: false,
    });
  const [passwordConditions, setPasswordConditions] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    special: false,
  });

  // AWS Cognito Configuration
  const clientId = "3jcmcoesbkdm2asd364v1q6das"; // Replace with your Cognito App Client ID
  const region = "us-east-1"; // Replace with your AWS Region

  AWS.config.update({
    region: region,
  });

  const cognito = new AWS.CognitoIdentityServiceProvider();

  const validateUsername = (value) => {
    setUsername(value);
    setUsernameConditions({
      length: value.length >= 3,
      format: /^[a-zA-Z0-9_]+$/.test(value),
    });
  };

  const validatePreferredUsername = (value) => {
    setPreferredUsername(value);
    setPreferredUsernameConditions({
      length: value.length >= 3,
      format: /^[a-zA-Z0-9_]+$/.test(value),
    });
  };

  const validatePassword = (value) => {
    setPassword(value);
    setPasswordConditions({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      digit: /\d/.test(value),
      special: /[^a-zA-Z0-9]/.test(value),
    });
  };

  const handleSignUp = async () => {
    if (
      !Object.values(usernameConditions).every(Boolean) ||
      !Object.values(preferredUsernameConditions).every(Boolean) ||
      !Object.values(passwordConditions).every(Boolean)
    ) {
      Alert.alert("Validation Error", "Please ensure all fields meet the requirements.");
      return;
    }

    try {
      const params = {
        ClientId: clientId,
        Username: username,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "preferred_username", Value: preferredUsername },
        ],
      };

      await cognito.signUp(params).promise();
      Alert.alert("Confirmation code sent to your email.");
      setIsCodeSent(true);
    } catch (error) {
      Alert.alert("Sign-Up Failed", error.message || JSON.stringify(error));
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      const params = {
        ClientId: clientId,
        Username: username,
        ConfirmationCode: confirmationCode,
      };

      await cognito.confirmSignUp(params).promise();
      Alert.alert("Sign-Up Successful");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Confirmation Failed", error.message || JSON.stringify(error));
    }
  };

  const renderCondition = (conditionMet, text) => (
    <Text style={conditionMet ? styles.validCondition : styles.invalidCondition}>
      {conditionMet ? "✓" : "×"} {text}
    </Text>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isCodeSent ? "Confirm Your Account" : "Sign Up"}</Text>
      {!isCodeSent ? (
        <>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={validateUsername}
            style={styles.input}
            autoCapitalize="none"
            onFocus={() => setFocusedField("username")}
          />
          {focusedField === "username" && (
            <>
              {renderCondition(usernameConditions.length, "At least 3 characters.")}
              {renderCondition(usernameConditions.format, "Only letters, numbers, or underscores.")}
            </>
          )}

          <TextInput
            placeholder="Preferred Username"
            value={preferredUsername}
            onChangeText={validatePreferredUsername}
            style={styles.input}
            autoCapitalize="none"
            onFocus={() => setFocusedField("preferredUsername")}
          />
          {focusedField === "preferredUsername" && (
            <>
              {renderCondition(preferredUsernameConditions.length, "At least 3 characters.")}
              {renderCondition(preferredUsernameConditions.format, "Only letters, numbers, or underscores.")}
            </>
          )}

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={validatePassword}
            secureTextEntry
            style={styles.input}
            onFocus={() => setFocusedField("password")}
          />
          {focusedField === "password" && (
            <>
              {renderCondition(passwordConditions.length, "At least 8 characters.")}
              {renderCondition(passwordConditions.uppercase, "At least one uppercase letter.")}
              {renderCondition(passwordConditions.lowercase, "At least one lowercase letter.")}
              {renderCondition(passwordConditions.digit, "At least one digit.")}
              {renderCondition(passwordConditions.special, "At least one special character.")}
            </>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Confirmation Code"
            value={confirmationCode}
            onChangeText={setConfirmationCode}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleConfirmSignUp}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  validCondition: {
    color: "green",
    fontSize: 14,
    marginVertical: 2,
  },
  invalidCondition: {
    color: "red",
    fontSize: 14,
    marginVertical: 2,
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
});

export default SignUpScreen;
