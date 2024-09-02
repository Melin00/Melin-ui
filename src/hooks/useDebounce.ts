import { useEffect, useState } from "react"

const useDebounce = (value: any, wait: number = 300) => {
    const [debouncedValue, setDebounceValue] = useState(value)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value)
        }, wait);
        return () => {
            clearTimeout(timer)
        }
    }, [value, wait])
    return debouncedValue
}

export default useDebounce