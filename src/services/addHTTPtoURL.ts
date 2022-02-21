/**
 * Add protocol to URL if it hasn't one.
 *
 * @example
 * addHTTPtoURL('some.test') // https://some.test
 * addHTTPtoURL('http://another.test') // http://another.test
 */

export default function addHTTPtoURL(string: string) {
    const isHasProtocol = /^(http[s]?:\/\/).{1,}/gm.test(string)

    return isHasProtocol ? string : `https://${string}`
}