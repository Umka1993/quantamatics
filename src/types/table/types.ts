
export interface IRow {
    editable: boolean
    row: {
        organization: string
        customerId: string
        customerLink: string
        comments?: string
    }
}

export interface IUserRow {
    editable: boolean
    row: {
        firstName: string
        lastName: string
        email: string
        expirationDate: string
    }
}
