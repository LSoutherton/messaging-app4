import axios from "axios";

export default axios.create({
    baseURL: 'https://messaging-app-ku7v.onrender.com/api/v1'
});