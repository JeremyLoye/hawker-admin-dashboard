import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  headers: {"X-API-KEY":process.env.REACT_APP_API_KEY}
});