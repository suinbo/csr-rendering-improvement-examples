import { Method } from "axios"

export type instanceConfig = {
    baseURL: string
}

export type ReactQueryConfig = {
    key?: string
    url?: string
    data?: any
    method?: Method
    headers?: any
}
