import { UserRole } from "../data/enum";

/**
 * A function to format server date to dot separated

 * @param date string in format 'mm/dd/yyy hh:mm:ss'
 *
 * @returns string date in format 'mm.dd.yyyy'
 *
 * @example
 *
 * const testDate = '10/11/2023 10:01:17';
 *
 * console.log(formatDate(testDate)) // 10.11.2023
 */

export function formatDate(date: string): string {
    const result = date.split(" ")[0];
    return result.replace(/[/]/g, ".");
}

export function adaptRoles(array: string[]): string[] {
    const formattedArray = array.filter(
        (role) => role !== UserRole.Coherence && role !== UserRole.Research
    );

    replaceItemInArray(formattedArray, UserRole.OrgAdmin, "Org. Admin");
    replaceItemInArray(formattedArray, UserRole.Admin, "Super Admin");
    replaceItemInArray(formattedArray, UserRole.OrgOwner, "Org. Owner");

    return formattedArray;
}

function replaceItemInArray(array: any[], oldValue: any, newValue: any) {
    if (array.includes(oldValue)) {
        const index = array.indexOf(oldValue);
        array[index] = newValue;
    }
}
