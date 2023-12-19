export const throttle = (handler: (...args: any[]) => void, timeout = 300) => {
    let lastInvokedTime = 0
    let timer: NodeJS.Timeout

    return function (this: any, ...args: any[]) {
        const now = Date.now()

        // 핸들러가 마지막으로 호출된 후 300ms 지났는지에 대한 여부
        if (now - lastInvokedTime >= timeout) {
            handler.apply(this, args)
            lastInvokedTime = now // 현재시간으로 갱신
        } else {
            clearTimeout(timer)
            timer = setTimeout(() => {
                handler.apply(this, args)
                lastInvokedTime = Date.now()
            }, timeout)
        }
    }
}

export const throttleByAnimationFrame = (handler: (...args: any[]) => void) =>
    function (this: any, ...args: any[]) {
        requestAnimationFrame(() => {
            handler.apply(this, args)
        })
    }
