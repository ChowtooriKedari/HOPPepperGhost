import React, { useState, useEffect, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import UploadScreen from "../screens/UploadScreen";
import VideoPlayerScreen from "../screens/VideoPlayerScreen";
import SplashScreen from "../screens/SplashScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import AboutScreen from "../screens/AboutScreen";

const Stack = createStackNavigator();
export const AuthContext = createContext(null);

// Contexts for configuration
export const ConfigContext = createContext(null);

// AWS S3 Config URL
const S3_JSON_URL = "https://peppersghostconfig.s3.eu-north-1.amazonaws.com/peppersGhostConfig.json";

export default function App() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState(null); // ✅ Start with null (don't show any screen yet)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Fetch configuration from AWS S3 before rendering anything
        const response = await axios.get(S3_JSON_URL);
        const configData = response.data;
        console.log("Loaded Config:", configData);
        setConfig(configData);

        // ✅ Decide where to go after Splash
        setInitialRoute("Splash"); // Splash will handle the final navigation
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setIsLoggedIn(!!token); // If token exists, set as logged in
    };
    checkLoginStatus();
  }, []);

  // **Wait until config is loaded before rendering anything**
  if (loading || initialRoute === null) {
    return null; 
  }

  return (
    <ConfigContext.Provider value={config}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}
              screenOptions={{
                headerStyle: { backgroundColor: "#6a1b9a" }, // Purple background
                headerTintColor: "#fff", // White text
                headerTitleAlign: "center",
              }}
        >
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Upload" component={UploadScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen
            name="VideoPlayerScreen"
            component={VideoPlayerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ConfigContext.Provider>
  );
}
