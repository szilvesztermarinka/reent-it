import axios from "axios";

axios.defaults.withCredentials = true;
export const authAPI = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/auth`,
});


export const appAPI = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/app`,

});