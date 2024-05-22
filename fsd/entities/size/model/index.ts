export interface ISize{
    id: string
    category: string
    name: string
    value?: string
    order?: number
    ProductSize?: {
        quantity: number
        barcodeId: string
        price?: number
    }
}
export interface IProductSize{
    productId: string
    categoryId: string
    quantity?: number
}
