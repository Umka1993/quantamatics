/**
 * Clamp number between two values with the following line:
*/
export default function clamp(num: number, min = 0, max = 100) {
	return Math.min(Math.max(num, min), max);
}
