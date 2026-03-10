import api from "./axios.js";

export const getCourses = () =>
  api.get("/courses/getCourses");

export const addCourse = (data) =>
  api.post("/courses/createCourse", data);

export const updateCourse = (courseId, data) =>
  api.put(`/courses/updateCourse/${courseId}`, data);

export const deleteCourse = (courseId) =>
  api.delete(`/courses/deleteCourse/${courseId}`);
