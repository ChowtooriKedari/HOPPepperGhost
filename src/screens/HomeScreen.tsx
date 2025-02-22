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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { createThumbnail } from 'react-native-create-thumbnail';
import { Svg, Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { ConfigContext } from '../Navigation/AppNavigator';

const HomeScreen = ({ navigation }) => {
  const config = useContext(ConfigContext);
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('A-Z');
  const [category, setCategory] = useState('all');
  const [thumbnails, setThumbnails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    if (config?.showLogin) {
      navigation.setOptions({
        headerLeft: null,
        headerRight: () => (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
              <Path
                d="M16 13v-2H8V9l-4 3 4 3v-2h8Zm6-9v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2ZM20 4H4v16h16V4Z"
                fill="#fff"
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
    }
  }, [navigation, config]);

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
    else if (sortOption === 'sortDefault') {
      sortedVideos;
    }
    return sortedVideos;
  };

  return (
    <LinearGradient colors={['#1a012a', '#4e148c']} style={styles.container}>
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

   {/* Sort and Category Dropdowns */}
   <View style={styles.dropdownContainer}>
        <View style={styles.dropdown}>
          <Picker selectedValue={sortOption} onValueChange={(itemValue) => setSortOption(itemValue)} style={styles.picker}>
            <Picker.Item label="Sort By" value="sortDefault" />
            <Picker.Item label="A-Z" value="A-Z" />
            <Picker.Item label="Z-A" value="Z-A" />
            <Picker.Item label="Last Updated" value="Last Updated" />
          </Picker>
        </View>
        <View style={styles.dropdown}>
          <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker}>
            <Picker.Item label="Category" value="all" />
            {/* <Picker.Item label="All" value="all" /> */}
            <Picker.Item label="Category 1" value="category1" />
            <Picker.Item label="Category 2" value="category2" />
          </Picker>
        </View>
      </View>
      
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
                {thumbnails[item.videoId] ? (
                  <Image source={{ uri: thumbnails[item.videoId] }} style={styles.thumbnail} />
                ) : (
                  <Text style={styles.thumbnailText}>Loading...</Text>
                )}
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
    color:'#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor:'#fff'
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
    borderRadius:20
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
    marginLeft:5,
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
    marginRight:4,
  },

  thumbnailPlaceholder: {
    flex: 1,
    margintop:50,
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
    marginTop:4,
    marginBottom:1
  },

  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Black fade effect at bottom
    justifyContent: 'flex-end',
    padding: 10,
  },

  title: {
    marginTop:6,
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
    marginBottom:10
  },

  uploadButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    zIndex: 1,
    elevation: 5,
    borderRadius:50
  },
});
export default HomeScreen;