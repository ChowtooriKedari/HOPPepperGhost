import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  ScrollView,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const UploadScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Category 1'); // Default category
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validation states
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleTitleChange = (text) => {
    if (text.length > 25) {
      setTitleError('Title should not exceed 25 characters.');
    } else {
      setTitleError('');
      setTitle(text);
    }
  };

  const handleDescriptionChange = (text) => {
    if (text.length > 100) {
      setDescriptionError('Description should not exceed 100 characters.');
    } else {
      setDescriptionError('');
      setDescription(text);
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      setFile(result[0]);
      Alert.alert('File Selected', `Selected file: ${result[0].name}`);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        Alert.alert('Error', 'An error occurred while selecting the file.');
      }
    }
  };

  const uploadFile = async () => {
    if (!file || titleError || descriptionError || !title || !description || !category) {
      Alert.alert('Missing Fields', 'Please fill in all fields, resolve errors, and select a file.');
      return;
    }

    setLoading(true);
    try {
      const metadataResponse = await axios.get(
        'https://ibn3ijxg8b.execute-api.us-east-1.amazonaws.com/dev/generatePreSignedURL',
        {
          params: {
            file_name: file.name,
            content_type: file.type,
          },
        }
      );

      const parsedBody = JSON.parse(metadataResponse.data.body);
      const uploadUrl = parsedBody.uploadUrl;
      const publicUrl = uploadUrl.split('?')[0];

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (uploadResponse.ok) {
        await saveVideoMetadata(publicUrl);
        Alert.alert('Upload Successful', 'Video uploaded successfully!');
        resetFields();
      } else {
        Alert.alert('Upload Failed', 'Failed to upload the video.');
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveVideoMetadata = async (publicUrl) => {
    try {
      await axios.post(
        'https://ibn3ijxg8b.execute-api.us-east-1.amazonaws.com/dev/saveVideoMetadata',
        {
          videoId: new Date().getTime().toString(),
          title,
          description,
          category,
          videoUrl: publicUrl,
          uploadDate: new Date().toISOString(),
        }
      );
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving video metadata.');
    }
  };

  const resetFields = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setCategory('Category 1');
  };

  return (
    <ScrollView 
      style={styles.scrollContainer} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false} // Hide vertical scrollbar
    >
      <View style={styles.container}>
        <TextInput
          placeholder="Title (Max 25 characters)"
          value={title}
          onChangeText={handleTitleChange}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

        <TextInput
          placeholder="Description (Max 100 characters)"
          value={description}
          onChangeText={handleDescriptionChange}
          style={[styles.input, styles.textArea]}
          placeholderTextColor="#aaa"
          multiline
        />
        {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Category</Text>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Category 1" value="category1" />
            <Picker.Item label="Category 2" value="category2" />
            <Picker.Item label="Category 3" value="category3" />
          </Picker>
        </View>

        {file && (
          <View style={styles.fileContainer}>
            <Text style={styles.fileText}>Selected File: {file.name}</Text>
          </View>
        )}

        <TouchableOpacity style={[styles.button, styles.pickButton]} onPress={pickFile}>
          <Text style={styles.buttonText}>Pick File</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.uploadButton,
            !file || titleError || descriptionError || !title || !description
              ? styles.disabledButton
              : {},
          ]}
          onPress={uploadFile}
          disabled={!file || titleError || descriptionError || !title || !description}
        >
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Uploading...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#0E1628',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: '#162030',
    color: '#fff',
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 10,
  },
  pickerContainer: {
    marginVertical: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#162030',
    color: '#fff',
  },
  fileContainer: {
    backgroundColor: '#1E88E5',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  fileText: {
    color: '#fff',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  pickButton: {
    backgroundColor: '#1E88E5',
  },
  uploadButton: {
    backgroundColor: '#43A047',
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
  },
});

export default UploadScreen;
