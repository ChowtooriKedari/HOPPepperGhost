import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import VideoPlayer from 'react-native-video-controls';

const VideoPlayerScreen = ({ route, navigation }) => {
  const { videoUrl } = route.params; // Get video URL from navigation params

  useEffect(() => {
    // Hide the status bar
    StatusBar.setHidden(true);
    return () => {
      // Restore the status bar when exiting the screen
      StatusBar.setHidden(false);
    };
  }, []);

  return (
    <View style={styles.container}>
      <VideoPlayer
        source={{ uri: videoUrl }}
        navigator={navigation} // To allow "back" button handling
        onBack={() => navigation.goBack()} // Custom back button action
        repeat // Enables looping
        style={styles.videoPlayer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
});

export default VideoPlayerScreen;
