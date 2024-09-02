import { RefObject, useEffect } from "react"

const useClickOutside = (ref: RefObject<HTMLElement>, handler: Function) => {
    const listener: EventListener = (e) => {
        if (!ref.current || ref.current.contains(e.target as HTMLElement)) {
            return
        }
        handler(e)
    }
    useEffect(() => {
        document.addEventListener('click', listener)
        return () => {
            document.removeEventListener('click', listener)
        }
    }, [])
}

export default useClickOutside