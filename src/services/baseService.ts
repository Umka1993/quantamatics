import { UserRole, SortDirection } from "../data/enum";

export const sortTable = (
    name: string,
    sort: any,
    localRows: any,
    setSort: any,
    setLocalRows: any
) => {    
    let newSort = sort;

    if (name === sort.name) {
        switch (sort.direction) {
            case SortDirection.Up:
                newSort.direction = SortDirection.Down;
                break;
            case SortDirection.Down:
                newSort.direction = SortDirection.Default;
                newSort.name = "";
                break;

            default:
                newSort.direction = SortDirection.Up;
                break;
        }
    } else {
        newSort.direction = SortDirection.Up;
        newSort.name = name;
    }

    setSort({ name: newSort.name, direction: newSort.direction });

    let newRows = [...localRows];

    switch (newSort.direction) {
        case SortDirection.Up:
            newRows.sort((a: any, b: any) => {
                const first = normalizeCompare(a, name);
                const second = normalizeCompare(b, name); 
                
                return first > second ? 1 : second > first ? -1 : 0;
            });
            break;

        case SortDirection.Down:
            newRows.sort((a: any, b: any) => {
                const first = normalizeCompare(a, name);
                const second = normalizeCompare(b, name); 
                
                return second > first
                    ? 1
                    : first > second
                        ? -1
                        : 0;
            });
            break;

        default:
            /* newRows = localStorage.getItem("rows")
                ? JSON.parse(localStorage.getItem("rows") as string)
                : localRows; */
            break;
    }

    setSort({ name: newSort.name, direction: newSort.direction });
    setLocalRows(newRows);
};

function normalizeCompare(item : any, name: string) {
    switch (name) {
        case "subscriptionEndDate":
            return new Date(item[name]);
    
        case "userRoles":
            return item[name];
    
        default:
            return item[name].toUpperCase()
    }      
}


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
    let result = date.split(" ")[0];
    return result.replace(/[/]/g, ".");
}


export function adaptRoles(array: string[]): string[] {
    const formattedArray = [...array];
  
    replaceItemInArray(formattedArray, UserRole.OrgAdmin, 'Org. Admin')
    replaceItemInArray(formattedArray, UserRole.Admin, 'Super Admin')
    replaceItemInArray(formattedArray, UserRole.OrgOwner, 'Org. Owner')

    return formattedArray;
    
}

function replaceItemInArray(array: any[], oldValue: any, newValue: any) {
    if (array.includes(oldValue)) {
        const index = array.indexOf(oldValue);
        array[index] = newValue
    }
}