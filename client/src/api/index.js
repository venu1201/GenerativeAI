import axios from 'axios';


// const API = axios.create({baseURL:'https://server-3v26ix77m-venu1201.vercel.app'});
const API = axios.create({baseURL:'http://127.0.0.1:8000/'});
const headers={Authorization:`Bearer`}
// const BASE_URL=  `http://localhost:5000`;

export const uploadfile=(file)=>API.post('/upload-file',file);

