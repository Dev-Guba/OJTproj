import axios from "axios";

const baseURL = "http://localhost:3000";

const Http = axios.create({
    baseURL,
    headers: {"Content-Type" : "application/json"},
});

export default Http;