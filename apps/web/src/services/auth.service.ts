import { ILogin, IRegister } from "../models/auth.model"

export const register = (data: IRegister) => {
    console.log('data', data)
}

export const login = (data: ILogin) => {
    console.log('data', data)
}