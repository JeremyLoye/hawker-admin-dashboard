import axios from 'axios';

export default axios.create({
  baseURL: `https://hb65mr6g85.execute-api.ap-southeast-1.amazonaws.com/dev/`
});