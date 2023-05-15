import { useRef } from "react";
import { debounce } from "lodash";

export default function useDebouncedInput (fn: (event: any) => void ,delay: number) {
    return useRef(
        debounce((event: any) => {
            fn(event)
        }, delay)
    ).current;
}