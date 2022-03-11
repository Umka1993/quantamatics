import { useEffect } from "react";

export const useClickOutside = (ref: any, callback: any, state: boolean) => {
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref?.current?.contains(event.target)) {
                callback()
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, state]);
}
