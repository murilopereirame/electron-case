import * as m from "mithril"
import Notification from "./Notification";
import {EToast} from "../components/Toast";

export interface IAuth {
    email: string
    password: string
    setEmail: (email: string) => void
    setPassword: (password: string) => void
    canSubmit: () => boolean
    setToken: (token: string, expDate: string) => void
    isLogged: () => boolean
    getToken: () => string
    login: () => Promise<boolean>
}

interface ILoginResponse {
    message: string
    data: {
        token: string
        validUntil: string
    },
    details: []
    status: string
}

const Auth: IAuth = {
    email: "",
    password: "",
    setEmail: (email: string) => {
        Auth.email = email
    },
    setPassword: (password: string) => {
        Auth.password = password
    },
    canSubmit: () => Auth.email !== "" && Auth.password !== "",
    setToken: (token: string, expDate: string) => {
        localStorage.setItem("access_token", token)
        localStorage.setItem("exp_date", expDate)
    },
    isLogged: () => localStorage
        .getItem("access_token") &&
        new Date(localStorage.getItem("exp_date")).getTime() > Date.now(),
    getToken: () => {
        return localStorage.getItem("access_token")
    },
    login: async () => {
        try {
            const loginResult: ILoginResponse = await m.request({
                url: "https://spring.murilopereira.dev.br:8443/users/auth",
                body: {
                    email: Auth.email,
                    password: Auth.password
                },
                method: "POST"
            })

            Auth.setToken(loginResult.data.token, loginResult.data.validUntil)
            Auth.setEmail("")
            Auth.setPassword("")
            return true
        } catch(e: any) {
            switch(e.code) {
                case 401:
                    Notification.show(
                      "User/Password invalid",
                      EToast.ERROR
                    )
                    break;
                default:
                    Notification.show(
                      "Sorry, we are unable to process your request at this moment =(",
                      EToast.ERROR
                    )
                break;
            }

            return false
        }
    }
}

export default Auth;