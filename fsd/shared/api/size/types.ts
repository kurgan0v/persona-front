export type SizesCreateFetcherRequest = {
    id?: string
    category: string
    name: string
    value?: string
}
export type SizesProductUpdateFetcherRequest = {
    productId: string
    sizeId: string
    quantity: number
}
