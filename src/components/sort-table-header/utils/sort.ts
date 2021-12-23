import { SortDirection } from "../../../data/enum";



const sortTable = (
    name: string,
    sort: any,
    localRows: any,
    setSort: any,
    setLocalRows: any
) => {    
    const newSort = sort;

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
            newRows = JSON.parse(sessionStorage.getItem('table-rows') as string);
            break;
    }

    setSort({ name: newSort.name, direction: newSort.direction });
    setLocalRows(newRows);
};

function normalizeCompare(item : any, name: string) {
    switch (name) {
        case "subscriptionEndDate":
            return item[name];
    
        case "userRoles":
            return item[name];
    
        default:
            return item[name].toUpperCase()
    }      
}


export default sortTable;