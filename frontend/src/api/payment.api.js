import api from './axios.js'

export const getAllStudentPayments = () =>
  api.get("/pay/getAllStudentPayments");

export const setupPayment = (data) =>
  api.post("/pay/setupPayment", data);

export const updatePayment = (paymentId, data) =>
  api.put(`/pay/update/${paymentId}`, data);