import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1"
});

export const uploadDocument = (studentId, type, file, onUploadProgress) => {

  const formData = new FormData();
  formData.append("document", file);

  return api.post(
    `/upload/student/${studentId}/upload/${type}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    }
  );
};

export const previewDocument = (studentId, type) => {
  return `http://localhost:8000/api/v1/upload/student/${studentId}/preview/${type}`;
};

export const downloadDocument = (studentId, type) => {
  return `http://localhost:8000/api/v1/upload/student/${studentId}/download/${type}`;
};