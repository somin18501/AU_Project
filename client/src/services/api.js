import axios from 'axios'

const API_URI = "http://127.0.0.1:8000";

export const Register = async (data) => {
    try {
        const response = await axios.post(`${API_URI}/signup`,data,{ withCredentials: true });
        return response.data;
    } catch (error) {
        console.log('Error while registering user', error.message);
    }
}

export const Login = async (data) => {
    try {
        const response = await axios.post(`${API_URI}/login`,data,{ withCredentials: true });
        return response.data;
    } catch (error) {
        console.log('Error while login', error.message);
    }
}

export const VerifyUser = async (data) => {
    try {
        const response = await axios.post(`${API_URI}`,data,{ withCredentials: true });
        return response.data;
    } catch (error) {
        console.log('Error while getting user data', error.message);
    }
}

export const UploadFile = async (data) => {
    try {
        const response = await axios.post(`${API_URI}/upload`,data,{ withCredentials: true });
        return response.data;
    } catch (error) {
        console.log('Error while getting user data', error.message);
    }
}