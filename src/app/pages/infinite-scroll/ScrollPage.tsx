import { mswRequest } from "@/utils/apis/request"
import { AxiosResponse } from "axios"
import { useRef, useState } from "react"
import { useQuery } from "react-query"
import styled from "styled-components"
import { throttle } from "./useThrottle"

type User = {
    id: string
    name: string
}

const Content = styled.div`
    overflow-y: auto;
    height: 400px;
    display: flex;
    background: #ebebeb;
`

const ScrollPage = () => {
    const [page, setPage] = useState(0)
    const [datas, setDatas] = useState<User[]>([])
    const refs = useRef<HTMLDivElement>(null)

    const queryKey = `users?pageNo=${page}&limit=50`

    useQuery<AxiosResponse<any>>(queryKey, () => mswRequest(queryKey), {
        refetchOnWindowFocus: false,
        onSuccess: res => {
            const {
                data: { contents },
            } = res

            setDatas(prev => [...prev, ...contents])
        },
    })

    const handleScroll = throttle(() => {
        if (refs.current) {
            /**
             * scrollTop 스크롤바가 아래로 움직일때 가려지는 요소 높이
             * clientHeight 컨텐츠와 패딩을 포함한 영역의 높이 (스크롤바 포함 X)
             * scrollHeight clientHeight + 스크롤 바에 의해 숨겨진 콘텐츠 영역 높이
             */
            const { scrollTop, clientHeight, scrollHeight } = refs.current
            const isAtBottom = scrollTop + clientHeight === scrollHeight

            if (isAtBottom) setPage(page + 1)
        }
    })

    return (
        <div>
            <Content ref={refs} onScroll={handleScroll}>
                <ul>
                    {datas.map(data => (
                        <li key={data.id}>{data.name}</li>
                    ))}
                </ul>
            </Content>
        </div>
    )
}

export default ScrollPage
