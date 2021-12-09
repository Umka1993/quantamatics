export default function getValidationMessage(
    validity: ValidityState, error?: string
): string {
    if (error) {
        return error;
    }

    const { tooShort, patternMismatch, tooLong } = validity;

    if (tooShort || patternMismatch) {
        const textStart = "Password must be ";
        const requirements = [];

        (tooShort || tooLong) && requirements.push("8-32 characters");
        patternMismatch &&
            requirements.push("and contain at least 1 number, 1 lower case character, 1 upper case character and 1 special character");

        return `${textStart} ${requirements.join(", ")}.`;
    }

    return "";
}
