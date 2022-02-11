/**
 * Delete spaces from begin and end of string. Multiple spaces in middle replaced with one.
 *
 * @example
 * 'Some Name' === normalizeName('   Some     Name   ') // true
 */
export default function normalizeName (name: string) : string{
    return name.trim().replace(/\s\s+/g, " ")
}