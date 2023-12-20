import axios from "axios"
import { useRef, useState } from "react"
import { QueryFunctionContext, useInfiniteQuery } from "react-query"
import styled from "styled-components"
import { useIntersect } from "./useIntersect"

type User = {
    id: string
    name: string
}

const Content = styled.div`
    overflow-y: auto;
    height: 400px;
    background: #ebebeb;
`
const Target = styled.div`
    height: 1px;
    position: relative;
    width: 100%;
    background: black;
`

const ObserverScrollPage = () => {
    const contentRef = useRef<HTMLDivElement>(null)
    const [users, setUsers] = useState<User[]>([])

    const useFetchUsers = () =>
        useInfiniteQuery(
            ["infiniteUsers"],
            ({ pageParam = 0 }: QueryFunctionContext) =>
                axios.get(`${window.location.origin}/users`, {
                    params: { pageNo: pageParam, limit: 50 },
                }),
            {
                refetchOnWindowFocus: false,

                // 다음 페이지 가져오기
                getNextPageParam: ({ data }) => {
                    const lastPage = data.contents[data.contents.length - 1]?.id
                    const page = Math.floor(lastPage / 50) + 1

                    return page
                },

                onSuccess: res => {
                    const { pages } = res
                    const lastPageIndex = pages.length - 1
                    setUsers(prev => [...prev, ...pages[lastPageIndex].data.contents])
                },
            }
        )

    const { isFetching, hasNextPage, fetchNextPage } = useFetchUsers()

    const ref = useIntersect(
        async (entry, observer) => {
            observer.unobserve(entry.target)

            if (!isFetching && hasNextPage) {
                fetchNextPage()
            }
        },
        { root: contentRef.current }
    )

    return (
        <div>
            <Content ref={contentRef}>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
                <Target ref={ref} />
            </Content>
        </div>
    )
}

export default ObserverScrollPage
