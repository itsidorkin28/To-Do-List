import {CommonResponseType} from './todolist-api';
import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '1e90b645-3ab8-4f0b-b1bb-01b70c47396d'
    },
})

export const authAPI = {
    autMe() {
        return instance.get<CommonResponseType<AuthMeType>>(`auth/me`)
    },
    login(data: LoginPramsType) {
        return instance.post<CommonResponseType<{ userId: number }>>(`auth/login/`, data)
    },
    logout() {
        return instance.delete<CommonResponseType<{}>>(`auth/login`)
    }
}
type AuthMeType = {
    id: number
    email: string
    login: string
}
export type LoginPramsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: boolean
}