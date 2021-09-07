export const sortTable = (name: string, sort:any, localRows:any, setSort:any, setLocalRows:any ) => {
    let newSort = sort
    if (name === sort.name) {
        if(sort.direction === 'none') {
            newSort.direction = 'asc'
        }
        else if(sort.direction === 'asc') {
            newSort.direction = 'desc'
        }
        else if(sort.direction === 'desc') {
            newSort.direction = 'none'
            newSort.name = ''
        }
    } else {
        newSort.direction = 'asc'
        newSort.name = name
    }

    let newRows = localRows
    if(newSort.direction === 'asc') {
        newRows.sort((a:any,b:any) => (a.row[name] > b.row[name]) ? 1 : ((b.row[name] > a.row[name]) ? -1 : 0))
    }else if (newSort.direction === 'desc') {
        newRows.sort((a:any,b:any) => (b.row[name] > a.row[name]) ? 1 : ((a.row[name] > b.row[name]) ? -1 : 0))
    } else if (newSort.direction === 'none') {
        newRows = localStorage.getItem('rows') ? JSON.parse(localStorage.getItem('rows') as string) : localRows
    }

    setSort({name: newSort.name, direction: newSort.direction})
    setLocalRows(newRows)
}