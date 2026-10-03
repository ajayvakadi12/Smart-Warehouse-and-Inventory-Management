import api from "./api";


// Login API
export const loginUser = async(data)=>{

    const response = await api.post(
        "/auth/login",
        data
    );

    return response.data;

};