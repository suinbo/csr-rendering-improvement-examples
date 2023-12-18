export interface APIData {
    data: { data: any }
}

export interface PaginationResponse<T> {
    contents: T[]
    pageNo: number
    limit: number
    offset: number
    totalCount: number
    totalPages: number
}
