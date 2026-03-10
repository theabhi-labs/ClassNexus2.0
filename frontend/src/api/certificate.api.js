import api from "./axios.js";

export const certificateIssue = (id) =>
  api.patch(`/certificate/complete/${id}`);

export const getCertificate = (certificateId) =>
  api.get(`/certificate/certificate/${certificateId}`, {
    responseType: "blob",
  });

export const verifyCertificate = (certificateId) =>
  api.get(`/certificate/verify/${certificateId}`);
