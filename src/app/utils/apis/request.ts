import { UseQueryOptions, useQueries, useQuery } from "react-query"
import { HTTP_METHOD_GET, RESPONSE_CODE, SPOTIFY_API_URL, SPOTIFY_AUTH_URL } from "./request.const"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { ReactQueryConfig } from "./request.types"

const instance = axios.create({
    baseURL: SPOTIFY_API_URL,
})

/**
 * Response and Error Custom
 * @returns Axios instance
 */
export const apiRequest = (req: AxiosRequestConfig) => {
    return instance(req)
        .then((response: AxiosResponse) => {
            const { data, headers, status } = response

            switch (status) {
                case RESPONSE_CODE.SUCCESS:
                    return { data, headers }
                default:
                    throw new Error("Error!!")
            }
        })
        .catch(error => {
            throw new Error(error)
        })
}

export const commonRequest = async (config: ReactQueryConfig) => {
    const token = localStorage.getItem("accessToken")

    const { key, ...apiConfig } = config
    const options = {
        ...apiConfig,
        baseURL: SPOTIFY_API_URL + key,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }

    return await apiRequest(options).then(response => response)
}

/** msw 이용한 mocking API */
export const mswRequest = async (key: string) => {
    return await axios.get("http://localhost:5173/" + key).then(response => response)
}

/**
 * Spotify Access Token 발급
 * @returns Promise객체
 */
export const tokenRequest = async () => {
    const authParam = {
        grant_type: "client_credentials",
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
    }

    return await instance
        .post(SPOTIFY_AUTH_URL, new URLSearchParams(authParam).toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then(response => {
            const token = response.data.access_token
            localStorage.setItem("accessToken", token)
            return token
        })
}

/**
 * Custom Hook
 * @description useQuery 훅 래핑
 * @param key url (고유 키 값)
 * @param options react-query option
 * [option] enabled 쿼리 자동 실행 여부
 * [option] suspense 비동기 통신 완료될 때까지 대기 (React-Suspense 모드와 함께 사용)
 * [option] refetchOnWindowFocus 화면 포커싱시 리패칭
 * [option] retry API 요청 실패시 재시도 여부
 */
export const useFetch = (key: string, options?: UseQueryOptions) => {
    return useQuery({
        queryKey: key,
        queryFn: () => commonRequest({ key, method: HTTP_METHOD_GET }),
        enabled: !!key,
        suspense: true,
        refetchOnWindowFocus: false,
        retry: false,
        ...options,
    })
}

/**
 * Custom Hook
 * @description useQueries 훅 래핑
 */
export const useFetches = (keys: string[], options?: UseQueryOptions) => {
    return useQueries(
        keys.map(key => ({
            queryKey: key,
            queryFn: () => commonRequest({ key, method: HTTP_METHOD_GET }),
            enabled: !!key,
            suspense: true,
            refetchOnWindowFocus: false,
            retry: false,
            ...options,
        }))
    )
}
