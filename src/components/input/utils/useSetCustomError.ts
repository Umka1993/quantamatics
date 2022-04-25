import { useEffect, useRef } from "react";

export default function useSetCustomError(error: string | undefined) {
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		inputRef.current &&
			(error
				? inputRef.current.setCustomValidity(error)
				: inputRef.current.setCustomValidity(""));
	}, [error, inputRef.current]);

	return inputRef;
}
