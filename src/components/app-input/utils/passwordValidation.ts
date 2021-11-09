export default function getValidationMessage(
    validity: ValidityState, error?: string
): string {
    if (error) {
        return error;
    }

    const { tooShort, patternMismatch } = validity;

    if (tooShort || patternMismatch) {
        const textStart = "The password must contain at least ";
        const requirements = [];

        tooShort && requirements.push("8 characters");
        patternMismatch &&
            requirements.push("1 uppercase letter, 1 digit and 1 special character");

        return `${textStart} ${requirements.join(", ")}.`;
    }

    return "";
}
