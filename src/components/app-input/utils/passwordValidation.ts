export default function getValidationMessage(
    validity: ValidityState, error?: string
): string {
    if (error) {
        return error;
    }

    const { tooShort, patternMismatch, tooLong } = validity;

    if (tooShort || tooLong || patternMismatch) {
        return 'Password must be 8-32 characters, and contain at least 1 number, 1 lower case character, 1 upper case character and 1 special character';
    }

    return "";
}
