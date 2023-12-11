/**
 * Sporify Access Token 발급
 * @returns Promise객체
 */
export const fetchToken = async () => {
    const authParam = {
        method: "POST",
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
