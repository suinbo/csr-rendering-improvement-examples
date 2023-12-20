import { useCallback, useEffect, useRef } from "react"

/**
 * [IntersectionObserver 옵션 인터페이스]
 *
 * @root target의 가시성을 확인할 때 사용되는 상위 속성 이름 (null : 브라우저 viewport)
 * @rootMargin root에 부여되는 마진값
 * @threshold 콜백 실행을 위해 target 의 가시성이 얼마나 필요한지 백분율로 표시
 */
interface IntersectionObserverInit {
    root?: Element | Document | null
    rootMargin?: string
    threshold?: number | number[]
}

type IntersectionHandler = (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void

/**
 * IntersectionObserver Custom Hook
 */
export const useIntersect = (onIntersect: IntersectionHandler, options?: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null)
    const callback = useCallback(
        (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            entries.forEach(entry => {
                // root와 target이 교차 상태인지 확인
                if (entry.isIntersecting) onIntersect(entry, observer)
            })
        },
        [onIntersect]
    )

    useEffect(() => {
        if (!ref.current) return
        const observer = new IntersectionObserver(callback, options)
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [ref, options, callback])

    return ref
}
