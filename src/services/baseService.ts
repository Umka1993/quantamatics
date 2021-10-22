export const sortTable = (name: string, sort: any, localRows: any, setSort: any, setLocalRows: any) => {

    let newSort = sort;

    if (name === sort.name) {
        switch (sort.direction) {
            case 'asc':
                newSort.direction = 'desc'
                break;
            case 'desc':
                newSort.direction = 'none'
                newSort.name = ''

            default:
                newSort.direction = 'asc'
                break;
        }
    } else {
        newSort.direction = 'asc'
        newSort.name = name
    }

    setSort({ name: newSort.name, direction: newSort.direction })

    let newRows = localRows

    switch (newSort.direction) {
        case 'asc':
            newRows.sort((a: any, b: any) => (a.row[name] > b.row[name]) ? 1 : ((b.row[name] > a.row[name]) ? -1 : 0))
            break;

        case 'desc':
            newRows.sort((a: any, b: any) => (b.row[name] > a.row[name]) ? 1 : ((a.row[name] > b.row[name]) ? -1 : 0))
            break;

        default:
            newRows = localStorage.getItem('rows') ? JSON.parse(localStorage.getItem('rows') as string) : localRows
            break;
    }

    setSort({ name: newSort.name, direction: newSort.direction })
    setLocalRows(newRows)

}