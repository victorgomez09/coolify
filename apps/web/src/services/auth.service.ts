import axios from "axios";

import { ILogin, IRegister } from "../models/auth.model";
import { api } from "../constants/api.constant";

export const register = async (data: IRegister) => {
    const result = await axios.post(`${api.url}/login`, {
        email: data.email.toLowerCase(),
        password: data.password,
        isLogin: false
    });

    return await result.data;
}

export const login = async (data: ILogin) => {
    const result = await axios.post(`${api.url}/login`, {
        email: data.email.toLowerCase(),
        password: data.password,
        isLogin: true
    });

    return await result.data;
}