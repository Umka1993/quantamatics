export const enum SortDirection {
    Down = 'descending',
    Up = 'ascending',
    Default = 'none'
}

export const sortTable = (name: string, sort: any, localRows: any, setSort: any, setLocalRows: any) => {

    let newSort = sort;

    if (name === sort.name) {
        switch (sort.direction) {
            case SortDirection.Up:
                newSort.direction = SortDirection.Down
                break;
            case SortDirection.Down:
                newSort.direction = SortDirection.Default
                newSort.name = ''
                break;

            default:
                newSort.direction = SortDirection.Up
                break;
        }
    } else {
        newSort.direction = SortDirection.Up
        newSort.name = name
    }



    setSort({ name: newSort.name, direction: newSort.direction })

    let newRows = localRows

    switch (newSort.direction) {
        case SortDirection.Up:
            newRows.sort((a: any, b: any) => (a.row[name] > b.row[name]) ? 1 : ((b.row[name] > a.row[name]) ? -1 : 0))
            break;

        case SortDirection.Down:
            newRows.sort((a: any, b: any) => (b.row[name] > a.row[name]) ? 1 : ((a.row[name] > b.row[name]) ? -1 : 0))
            break;

        default:
            newRows = localStorage.getItem('rows') ? JSON.parse(localStorage.getItem('rows') as string) : localRows
            break;
    }

    setSort({ name: newSort.name, direction: newSort.direction })
    setLocalRows(newRows)
}