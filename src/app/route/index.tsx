import { Suspense, lazy } from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Home from "@/pages/Home"
import TokenStore from "@/pages/react-query-example/TokenStore"
import ReactQueryExample from "@/pages/react-query-example/ReactQueryExample"

/**
 * react-router-dom v6
 * @description react-router-dom 기반의 CSR 라우팅 - 객체 형태 라우팅
 * @description lazy - 코드 스플리팅(페이지 번들 지연 로딩)
 * */
const Router = () => {
    const LazyHome = lazy(() => import("@/pages/LazyHome"))

    const objectRouter = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/lazy-home",
            element: (
                <Suspense fallback={"...Loading"}>
                    <LazyHome />
                </Suspense>
            ),
        },
        {
            path: "/token",
            element: <TokenStore />,
        },
        {
            path: "/react-query-test",
            element: <ReactQueryExample />,
        },
    ])

    return <RouterProvider router={objectRouter} />
}

export default Router
