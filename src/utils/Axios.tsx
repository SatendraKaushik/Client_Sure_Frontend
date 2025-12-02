// import axios from "axios";

// const Axios = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
//   withCredentials: true,
//   timeout: 30000, // 30 seconds timeout
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// // Request interceptor for error handling
// Axios.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// Axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.code === 'ECONNABORTED') {
//       console.error('Request timeout');
//     }
//     return Promise.reject(error);
//   }
// );

// export default Axios;
import axios from "axios";

// const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const baseURL =  "https:client-sure-backend.vercel.app/api";
const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: false,
});

// Request interceptor to add auth token
Axios.interceptors.request.use(
  (config) => {
    // Check for admin token first, then regular user token
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");
    

    const token = adminToken  || userToken;

    if (token) {
      // Remove quotes if token is stored as JSON string
      const cleanToken = token.replace(/^"|"$/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Axios;