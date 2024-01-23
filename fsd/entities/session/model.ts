interface UserData {
    device: string
    browser: string
}

export interface ISession extends UserData {
    id: string
    createdAt: string
}
