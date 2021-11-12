export default function getValidationMessage(validity: ValidityState, error?: string) {
    if (error) {
        return error;
    }

    const { patternMismatch } = validity;

    if (patternMismatch) {
        return 'This is not a valid email';
    }

    return "";
}