import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export const loginUser = (data) => API.post("/auth/login", data);

export const getCustomers = () => API.get("/customers");
export const createCustomer = (data) => API.post("/customers", data);

export const getProducts = () => API.get("/products");
export const createProduct = (data) => API.post("/products", data);

export const getSales = () => API.get("/sales");
export const createSale = (data) => API.post("/sales", data);
export const updateSale = (id, data) => API.put(`/sales/${id}`, data);
export const deleteSale = (id) => API.delete(`/sales/${id}`);

export const getDailyReport = (date) => API.get(`/reports/daily?date=${date}`);
export const getWeeklyReport = (date) => API.get(`/reports/weekly?date=${date}`);
export const getMonthlyReport = (month, year) =>
  API.get(`/reports/monthly?month=${month}&year=${year}`);
export const getCustomersReport = () => API.get("/reports/customers");
export const getProductsReport = () => API.get("/reports/products");
export const getSummary = () => API.get("/reports/summary");

export default API;
