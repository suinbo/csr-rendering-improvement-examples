import { UseQueryOptions, useQuery } from "react-query"
import { HTTP_METHOD_GET, HTTP_METHOD_POST, SPOTIFY_API_URL } from "./request.const"

/**
 * Spotify Access Token 발급
 * @returns Promise객체
 */
export const fetchToken = async () => {
    const authParam = {
        method: HTTP_METHOD_POST,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body:
            "grant_type=client_credentials&client_id=" +
            import.meta.env.VITE_SPOTIFY_CLIENT_ID +
            "&client_secret=" +
            import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
    }

    const res = await fetch("https://accounts.spotify.com/api/token", authParam)
    const response = await res.json()
    return response.access_token
}

export const apiRequest = async (endpoint: string) => {
    const params = {
        method: HTTP_METHOD_GET,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
    }

    const response = await fetch(SPOTIFY_API_URL + endpoint, params)
    return response.json()
}

/**
 * Custom Hook
 * @description useQuery 훅 래핑
 * [option] suspense 비동기 통신 완료될 때까지 대기
 * [option] refetchOnWindowFocus 화면 포커싱시 리패칭
 * [option] enabled 쿼리 자동 실행 여부
 */
export const useFetch = (config: UseQueryOptions) => {
    return useQuery({
        ...config,
        suspense: true,
        refetchOnWindowFocus: false,
    })
}
