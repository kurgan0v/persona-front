import {IRequest} from "@/fsd/entities/request/model";

export type RequestsFetcherRequest = {
    page: number
    dateStart?: string
    dateEnd?: string
    status?: string[]
}
export type RequestsFetcherResponse = {
    total: number
    requests: IRequest[]
}
export type RequestUpdateFetcherRequest = {
    id: string
    status?: number
    admin_comment?: string
}
