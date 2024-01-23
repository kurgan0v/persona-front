export type ILoginFetcherRequest = {
    login: string
    password: string
}
type Session = {
    id: string
    device: string
    browser: string
    createdAt: string
}
export type ILoginFetcherResponse = {
    code: number
    accessToken?: string
    error?: string
    sessions?: Session[]
}
export type IDeleteSessionFetcherRequest = {
    id: string
    temporaryToken: string
}
