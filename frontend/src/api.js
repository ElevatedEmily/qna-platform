import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

// Example: Fetch posts
export const fetchPosts = async () => {
  const response = await API.get("/posts");
  return response.data;
};
