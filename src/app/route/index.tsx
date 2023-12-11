import { Suspense, lazy } from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Home from "@/pages/Home"
import APITest from "@/pages/APITest"

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
            path: "/lazyHome",
            element: (
                <Suspense fallback={"...Loading"}>
                    <LazyHome />
                </Suspense>
            ),
        },
        {
            path: "/apiTest",
            element: <APITest />,
        },
    ])

    return <RouterProvider router={objectRouter} />
}

export default Router
