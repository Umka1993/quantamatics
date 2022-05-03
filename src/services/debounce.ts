// eslint-disable-next-line @typescript-eslint/ban-types
export default function debounce(callback: Function, delay = 1000) {
	let timeout: number;

	return (...args: unknown[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => callback(...args), delay);
	};
}
