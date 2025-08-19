import axios from 'axios';

const API = axios.create({ baseURL:   baseURL:
    "https://image-generation-0g9d.onrender.com/api/" ||
    "http://localhost:8080/api/", });

export const GetPosts = async () => await API.get("/post/");
export const CreatePost = async (data) => await API.post("/post/", data);
export const GenerateAIImage = async (data) => await API.post("/generateImage/", data); 
