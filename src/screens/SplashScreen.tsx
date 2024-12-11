import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Optionally, navigate to the main app after a timeout (fallback in case the video fails)
    const timeout = setTimeout(() => {
      navigation.replace('Login'); // Replace 'Home' with your initial screen
    }, 5000); // Adjust to match your video duration

    return () => clearTimeout(timeout);
  }, [navigation]);

  const handleVideoEnd = () => {
    navigation.replace('Login'); // Replace 'Home' with your initial screen
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/PepperGhost.mp4')} // Replace with your video file path
        style={styles.video}
        resizeMode="cover"
        onEnd={handleVideoEnd}
        repeat={false} // Set to true if you want the video to loop
        muted={false}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021926', // Set your desired background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '50%',
    height: '50%',
  },
});

export default SplashScreen;
