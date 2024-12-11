import axios from 'axios';

const API_URL = 'http://localhost:5000/api/videos';

export const uploadVideo = async (token: string, data: FormData) => {
    const response = await axios.post(`${API_URL}/upload`, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const fetchVideos = async () => {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
};
