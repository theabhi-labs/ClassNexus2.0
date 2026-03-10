import api from "./axios";


 const registerUser = (data) => {
  return api.post("/users/register", data);
};


 const loginUser = (data) => {
  return api.post("/users/login", data);
};


 const getCurrentUser = () => {
  return api.get("/users/me");
};


 const logoutUser = () => {
  return api.post("/users/logout");
};

const refreshTokenRequest = async () => {
  const res = await api.post("/users/refresh-token", {}, {
    withCredentials: true
  });
  return res.data;
};


export {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    refreshTokenRequest
}
