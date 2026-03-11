import axios from "axios";

const api = axios.create({
  baseURL: "https://class-nexus-api-w5d9.onrender.com",
  withCredentials: true
});

export default api;
