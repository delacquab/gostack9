import axios from "axios";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

const api = axios.create({
  baseURL: "http://localhost:3333"
});

export default api;
