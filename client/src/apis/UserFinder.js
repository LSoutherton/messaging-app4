import axios from "axios";

export default axios.create({
    baseURL: 'https://messaging-web-app-3.onrender.com/api/v1'
    // baseURL: 'http://localhost:3001/api/v1'
});