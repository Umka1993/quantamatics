import { useState } from "react";

export default function useArray<Element = string>(initialValue: Element[]) {
	const [array, setArray] = useState(initialValue);

	function push(newElement: Element) {
		setArray((prevState) => [...prevState, newElement]);
	}

	function filter(
		callback: (
			value: Element,
			index: number,
			array: Element[]
		) => value is Element
	) {
		setArray((prevState) => prevState.filter(callback));
	}

	function update(index: number, newElement: Element) {
		setArray((prevState) => [
			...prevState.slice(0, index),
			newElement,
			...prevState.slice(index + 1, prevState.length - 1),
		]);
	}

	function remove(index: number) {
		setArray((prevState) => [
			...prevState.slice(0, index),
			...prevState.slice(index + 1, prevState.length - 1),
		]);
	}

	function clear() {
		setArray([]);
	}

	return { array, set: setArray, push, filter, update, remove, clear };
}
