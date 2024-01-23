export type CharacteristicsTypeCreateFetcherRequest = {
    name: string
    category: string
}
export type CharacteristicCreateFetcherRequest = {
    name: string
    type: string
}
export type CharacteristicsProductUpdateFetcherRequest = {
    productId: string
    characteristic: string
    newValue: string
}
