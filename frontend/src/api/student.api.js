import api from "./axios.js";

export const enrollStudent = (data) => {
  const token = localStorage.getItem("token"); // ya cookies se
  return api.post("/students/add", data, {
    withCredentials: true, // cookie bhi send karega
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
};

export const updateStudent = (id, data) => {
  return api.put(`/students/update-full/${id}`, data, {
    withCredentials: true, 
    headers: { "Content-Type": "application/json" },
  });
};

export const getUserProfile = (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token missing");

  return api.get(`/students/${id}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Other APIs can remain the same if they don't require auth
export const adminDashboardStudents = () => api.get("/students/admin-overview");
export const getAllStudents = () => api.get("/students/getAllStudents");
export const getStudentDetails = (studentId) => api.get(`/students/${studentId}`);
export const updateEnrollment = (enrollmentId, data) => api.put(`/students/enrollment/${enrollmentId}`, data);
export const deleteStudent = (studentId) => api.delete(`/students/${studentId}`);

