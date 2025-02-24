import axios from "axios";

export const axiosPublic = axios.create({
    // baseURL: 'https://tms-server-sq5b.onrender.com'
    baseURL: 'http://localhost:4564'
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;