import React, { useState, useEffect } from 'react';
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

const HomeScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('A-Z');
  const [category, setCategory] = useState('all');
  const [thumbnails, setThumbnails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.replace('Login');
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: null,
      headerRight: () => (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
          >
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
        backgroundColor: '#1E88E5',
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
      //console.error('Error fetching videos:', error);
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
      sortedVideos.sort(
        (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
      );
    }
    return sortedVideos;
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={fetchVideos} style={styles.searchIcon}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
          >
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
          <Text style={styles.dropdownLabel}>Sort by:</Text>
          <Picker
            selectedValue={sortOption}
            onValueChange={(itemValue) => setSortOption(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="A-Z" value="A-Z" />
            <Picker.Item label="Z-A" value="Z-A" />
            <Picker.Item label="Last Updated" value="Last Updated" />
          </Picker>
        </View>
        <View style={styles.dropdown}>
          <Text style={styles.dropdownLabel}>Category:</Text>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Category 1" value="category1" />
            <Picker.Item label="Category 2" value="category2" />
          </Picker>
        </View>
      </View>

      {/* Video List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#1E88E5" />
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.videoId.toString()}
          renderItem={({ item }) => (
            <View style={styles.videoItem}>
              <TouchableOpacity
                style={styles.thumbnailPlaceholder}
                onPress={() =>
                  navigation.navigate('VideoPlayerScreen', { videoUrl: item.videoUrl })
                }
              >
                {thumbnails[item.videoId] ? (
                  <Image source={{ uri: thumbnails[item.videoId] }} style={styles.thumbnail} />
                ) : (
                  <Text style={styles.thumbnailText}>Loading...</Text>
                )}
              </TouchableOpacity>
              <View style={styles.videoDetails}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.category}>
                  Last Updated: {new Date(item.uploadDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        />
      )}

      {/* Upload Button */}
      <View style={styles.uploadButtonContainer}>
        <Button
          title="Upload Video"
          onPress={() => navigation.navigate('Upload')}
          color="#0cb354"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#2C2C2C',
  },
  logoutButton: {
    marginRight: 15,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    height: 40,
    color: '#000',
  },
  searchIcon: {
    padding: 10,
    backgroundColor: '#1E88E5',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
    backgroundColor: '#1E88E5',
    borderRadius: 5,
  },
  videoItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#1E88E5',
    borderRadius: 5,
  },
  thumbnailPlaceholder: {
    width: 100,
    height: 60,
    backgroundColor: '#004BA0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  thumbnailText: {
    color: '#fff',
    fontSize: 14,
  },
  videoDetails: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  description: {
    color: '#fff',
    fontSize: 14,
  },

  category: {
    color: '#fff',
    fontSize: 12,
    fontStyle: 'italic',
  },

  uploadButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    zIndex: 1,
    elevation: 5,
  },
});

export default HomeScreen;
