import {IProduct} from "@/fsd/entities/product/model";

export interface IRequest{
    id: string
    status: number
    name: string
    phone: string
    createdAt: string
    updatedAt: string
    comment?: string
    admin_comment?: string
    attachments?: string[]
    type: number
    product_id?: string
    product: IProduct
}
