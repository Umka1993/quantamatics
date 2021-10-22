
export interface IRow {
    editable: boolean
    row: {
        id: string
        name: string
        customerCrmId: string
        customerCrmLink: string
        comments?: string
        assets?: string
    }
}

export interface IUserRow {
    editable: boolean
    row: {
        id: number,
        firstName: string
        lastName: string
        email: string
        subscriptionEndDate: string
    }
}
