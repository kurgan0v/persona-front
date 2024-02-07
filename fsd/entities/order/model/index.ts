import {IProduct} from "@/fsd/entities/product/model";
import {ISize} from "@/fsd/entities/size/model";

export interface IOrder{
    id: number
    client_name: string
    phone: string
    email: string
    status: number
    address?: {[key:string]: string | number}
    requisites?: {[key:string]: string}
    delivery_cost?: number
    delivery_type: number
    payment_method: number
    delivery_status: number
    online_payment_status: number
    createdAt: string
    updatedAt: string
    OrderItems: IOrderItem[]
    comment?: string
    paymentInfo?: {
        status: string
        paymentLink: string
    }
    invoice_id?: string
    payment_link?: string
    payment_approved?: boolean
}
export interface IOrderItem {
    id: string
    product_id: string
    size_id: string
    quantity: number
    order_id: number
    title: string
    size_name: string
    price: number
    sale_price?: number
    product?: IProduct
    size?: ISize
}
