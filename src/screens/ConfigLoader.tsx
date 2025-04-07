import React, { useEffect, useState, createContext } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import axios from "axios";

// S3 JSON URL (Replace with your actual S3 URL)
const S3_JSON_URL = "https://pepperghostconfiguseast.s3.us-east-1.amazonaws.com/peppersGhostConfig.json";

// Create a context to store config globally
export const ConfigContext = createContext(null);

const ConfigLoader = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(S3_JSON_URL);
        setConfig(response.data);
      } catch (error) {
        // console.log("Error");
        // console.error("Error fetching config new: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading configuration...</Text>
      </View>
    );
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigLoader;
