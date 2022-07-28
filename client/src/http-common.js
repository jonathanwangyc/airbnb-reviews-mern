import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5050/api/v1/airbnb", // backend server url
  headers: {
    "Content-type": "application/json"
  }
});