/**
 * Add protocol to URL if it hasn't one.
 *
 * @example
 * addHTTPtoURL('some.test') // https://some.test
 * addHTTPtoURL('http://another.test') // http://another.test
 * addHTTPtoURL('') // ''
 */

export default function addHTTPtoURL(string: string) {
	const isHasProtocol = /^(http[s]?:\/\/).{1,}/gm.test(string);

	if (isHasProtocol || !string.length) {
		return string;
	}

	return `https://${string}`;
}
