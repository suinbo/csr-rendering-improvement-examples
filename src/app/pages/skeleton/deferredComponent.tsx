import { PropsWithChildren, useEffect, useState } from "react"

const DeferredComponent = ({ children }: PropsWithChildren) => {
    const [isDeffered, setIsDeffered] = useState(false)

    useEffect(() => {
        // 200ms 지난 후 children render
        const timeoutId = setTimeout(() => {
            setIsDeffered(true)
        }, 200)

        return () => clearTimeout(timeoutId)
    }, [])

    if (!isDeffered) {
        return null
    }

    return <>{children}</>
}

export default DeferredComponent
