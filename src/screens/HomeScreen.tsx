import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  ActivityIndicator,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { createThumbnail } from 'react-native-create-thumbnail';
import { Svg, Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { ConfigContext } from '../Navigation/AppNavigator';
import Video from 'react-native-video';
import RNPickerSelect from "react-native-picker-select";

const HomeScreen = ({ navigation }) => {
  const config = useContext(ConfigContext);
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('A-Z');
  const [category, setCategory] = useState('all');
  const [thumbnails, setThumbnails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Hamburger menu state

  useEffect(() => {
    if (config?.showLogin) {
      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          navigation.replace('Login');
        }
      };
      checkLoginStatus();
    }
  }, [config]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: null,
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.hamburgerButton}>
          <Svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 6h18M3 12h18m-18 6h18"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        color: '#fff',
      },
      headerStyle: {
        backgroundColor: '#6a1b9a',
      },
    });
  }, [navigation]);

  useEffect(() => {
    fetchVideos();
  }, [category]);

  useEffect(() => {
    setVideos((prevVideos) => sortVideos(prevVideos));
  }, [sortOption]);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://efogwy1o0e.execute-api.eu-north-1.amazonaws.com/dev/fetchVideos`,
        { params: { searchQuery, category } }
      );
      const parsedVideos = response.data;
      const sortedVideos = sortVideos(parsedVideos);
      setVideos(sortedVideos);
      generateThumbnails(parsedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
    setIsLoading(false);
  };

  const generateThumbnails = async (videoList) => {
    const thumbnailsMap = {};
    for (const video of videoList) {
      try {
        const thumbnail = await createThumbnail({
          url: video.videoUrl,
          timeStamp: 1000,
        });
        thumbnailsMap[video.videoId] = thumbnail.path;
      } catch (error) {
        console.error(`Error generating thumbnail for ${video.videoId}:`, error);
      }
    }
    setThumbnails(thumbnailsMap);
  };

  const sortVideos = (videos) => {
    if (!videos || videos.length === 0) return [];
    const sortedVideos = [...videos];
    if (sortOption === 'A-Z') {
      sortedVideos.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'Z-A') {
      sortedVideos.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === 'Last Updated') {
      sortedVideos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    }
    return sortedVideos;
  };

  return (
    <LinearGradient colors={['#1a012a', '#4e148c']} style={styles.container}>
      {/* Hamburger Menu Modal */}
      {/* Hamburger Menu Modal */}
{/* Hamburger Menu Modal */}
{/* Hamburger Menu Modal */}
<Modal
  transparent
  visible={isMenuVisible}
  animationType="fade"
  onRequestClose={() => setIsMenuVisible(false)}
>
  <TouchableOpacity
    style={styles.menuOverlay}
    activeOpacity={1}
    onPress={() => setIsMenuVisible(false)} // Close when clicking outside
  >
    <View style={styles.menuContainer}>
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setIsMenuVisible(false)}
      >
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 6L6 18M6 6l12 12"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>

      {/* About Option */}
      <TouchableOpacity
        onPress={() => {
          setIsMenuVisible(false);
          navigation.navigate("About");
        }}
        style={styles.About}
      >
        <Text style={styles.menuText}>About</Text>
      </TouchableOpacity>

      {/* Tutorial Option */}
      <TouchableOpacity
        onPress={() => {
          setIsMenuVisible(false);
          navigation.navigate("Splash");
        }}
        style={styles.WelcomePage}
      >
        <Text style={styles.menuText}>Welcome Page</Text>
      </TouchableOpacity>

      {/* Logout Option (Only if config?.showLogin is true) */}
      {!config?.showLogin && (
        <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={styles.menuIcon}>
            <Path
              d="M16 13v-2H8V9l-4 3 4 3v-2h8Zm6-9v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2ZM20 4H4v16h16V4Z"
              fill="#fff"
            />
          </Svg>
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  </TouchableOpacity>
</Modal>

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          style={[styles.searchInput, { color: '#fff' }]} // Text color here
          placeholder="Search"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          placeholderTextColor="#fff"
        />
        <TouchableOpacity onPress={fetchVideos} style={styles.searchIcon}>
          <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
            <Path
              d="M10 2C5.588 2 2 5.588 2 10c0 4.413 3.588 8 8 8 1.793 0 3.432-.588 4.764-1.568l4.902 4.9a1.002 1.002 0 0 0 1.413-1.413l-4.9-4.902C17.413 13.432 18 11.793 18 10c0-4.413-3.588-8-8-8ZM4 10a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z"
              fill="#fff"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.pickerWrapper}>
  <RNPickerSelect
    onValueChange={(value) => setSortOption(value)}
    items={[
      { label: "Sort By", value: "sortDefault" },
      { label: "A-Z", value: "A-Z" },
      { label: "Z-A", value: "Z-A" },
      { label: "Last Updated", value: "Last Updated" },
    ]}
    style={{
      inputIOS: styles.pickerInput,
      inputAndroid: styles.pickerInput,
      placeholder: styles.placeholderText,
    }}
    useNativeAndroidPickerStyle={false}
    placeholder={{ label: "Sort By", value: "sortDefault" }}
  />
</View>


<View style={styles.pickerWrapper}>
  <RNPickerSelect
    onValueChange={(value) => setCategory(value)}
    items={[
      { label: "Category", value: "all" },
      { label: "Category 1", value: "category1" },
      { label: "Category 2", value: "category2" },
    ]}
    style={{
      inputIOS: styles.pickerInput,
      inputAndroid: styles.pickerInput,
      placeholder: styles.placeholderText,
    }}    useNativeAndroidPickerStyle={false}
    placeholder={{ label: "Category", value: "all" }}
  />
</View> */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#6a1b9a" />
      ) : (

        <FlatList
          data={videos}
          keyExtractor={(item) => item.videoId.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.videoItem}>
              <TouchableOpacity
                style={styles.thumbnailPlaceholder}
                onPress={() => navigation.navigate('VideoPlayerScreen', { videoUrl: item.videoUrl })}
              >
                <Video
                  source={{ uri: item.videoUrl }} // Video URL from API
                  style={styles.videoPlayer}
                  resizeMode="cover"
                  repeat
                  muted
                  playInBackground={false} // Ensures it stops when navigating away
                  playWhenInactive={false}
                  ignoreSilentSwitch="obey"
                />
                <LinearGradient colors={['transparent', 'black']} style={styles.overlay} />
              </TouchableOpacity>

              <View style={styles.videoDetails}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.category}>Last Updated: {new Date(item.uploadDate).toLocaleDateString()}</Text>
              </View>
            </View>
          )}
        />


      )}
      {config?.showUpload && (
        <View style={styles.uploadButtonContainer}>
          <Button title="UPLOAD VIDEO" onPress={() => navigation.navigate("Upload")} color="#1a012a" />
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    color: "#fff",
    backgroundColor: "#4e148c", // Purple background
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    color: "#fff",
    backgroundColor: "#4e148c",
  },
  placeholder: {
    color: "#ccc", // Lighter text for placeholder
  },
  hamburgerButton: {
    marginRight: 15,
    padding: 10,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dim background
    justifyContent: "flex-start",
    alignItems: "flex-end", // Align menu to the right
  },
  menuContainer: {
    backgroundColor: "#121212",
    width: "50%", // Cover half the screen width
    height: "100%", // Full height
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10, // Rounded left side
    borderBottomLeftRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: 55,
    left: 55, // Align close button to left (inside menu)
    padding: 10,
  },
  menuHeader: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  About: {
    marginTop:65,
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center", // Align items vertically
    paddingVertical: 15,
  },
  WelcomePage: {
    // marginTop:10,
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center", // Align items vertically
    paddingVertical: 15,
  },

  menuItem: {
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center", // Align items vertically
    paddingVertical: 15,
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10, // Space between icon and text
  },
  menuIcon: {
    width: 24,
    height: 24,
  },

  container: {
    flex: 1,
    padding: 10,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },

  logoutButton: {
    marginRight: 15,
  },

  searchBarContainer: {
    color: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },

  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    height: 40,
  },

  searchIcon: {
    padding: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderRadius: 20,
    paddingHorizontal: 5,
  },

  dropdown: {
    flex: 1,
    marginHorizontal: 5,
  },

  dropdownLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },

  picker: {
    color: '#fff',
    backgroundColor: '#4e148c',
    borderRadius: 10,
  },

  videoGrid: {
    marginLeft: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  videoItem: {
    width: '49%', // Ensures spacing between videos
    aspectRatio: 9 / 12, // Keeps video aspect ratio
    borderRadius: 25,
    marginBottom: 4, // Adds space between rows
    backgroundColor: '#000',
    overflow: 'hidden',
    marginRight: 4,
  },

  thumbnailPlaceholder: {
    flex: 1,
    margintop: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 10, // Adds space between columns
  },

  thumbnail: {
    width: '100%',
    height: '94%',
    borderRadius: 20,
    marginTop: 4,
    marginBottom: 1
  },

  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Black fade effect at bottom
    justifyContent: 'flex-end',
    padding: 10,
  },

  title: {
    marginTop: 6,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },

  description: {
    color: '#bbb',
    fontSize: 12,
    textAlign: 'center',
  },

  category: {
    color: '#bbb',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 10
  },

  uploadButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    zIndex: 1,
    elevation: 5,
    borderRadius: 50
  },
  videoPlayer: {
    width: "100%",
    overflow: "hidden",
    height: '94%',
    borderRadius: 20,
    marginTop: 4,
    marginBottom: 1
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    backgroundColor: "#4e148c",
    marginBottom: 10,
  },
  pickerInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "#fff",
  },
  placeholderText: {
    color: "#ccc", // Lighter text for placeholder
  },
});

export default HomeScreen;
