import React, { useCallback, useEffect, Dispatch, SetStateAction } from "react"

export default function useCloseModal(flag: boolean, setter: Dispatch<SetStateAction<boolean>>) : void {
    const closeModal = useCallback(() => setter(false), [flag])
    useEffect(() => {
        flag && document.addEventListener('click', closeModal)
        return () => document.removeEventListener('click', closeModal)
    }, [flag])
}