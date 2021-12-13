export default function getValidationMessage(
    validity: ValidityState
): string {

    const { tooShort, patternMismatch, tooLong } = validity;

    if (tooShort || tooLong || patternMismatch) {
        return 'Password must be 8-32 characters, and contain at least 1 number, 1 lower case character, 1 upper case character and 1 special character';
    }

    return "";
}
