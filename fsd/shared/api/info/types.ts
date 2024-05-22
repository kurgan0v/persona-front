import {IInfo} from "@/fsd/entities/info/model";

export type InfoFetcherRequest = {
    info: IInfo[]
    phone: string
    email: string
    vk?: string
    instagram?: string
}
export type InfoUpdateFetcherRequest = {
    id: string
    name?: string
    cover?: string
    text?: string
    visible?: boolean
}
export type IContactsFetcher = {
    phone: string
    email: string
    vk: string
    instagram: string
}
export type IMainSeoFetcher = {
    title: string
    description: string
}
