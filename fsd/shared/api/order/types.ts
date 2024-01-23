import {IOrder} from "@/fsd/entities/order/model";
import {IRequest} from "@/fsd/entities/request/model";

export type IOrderNew = Omit<IOrder, 'id' | 'status' | 'delivery_cost' | 'delivery_status' | 'online_payment_status'>
export type OrdersFetcherRequest = {
    page: number
    dateStart?: string
    dateEnd?: string
    status?: string[]
}
export type OrdersFetcherResponse = {
    total: number
    orders: IOrder[]
}
export type OrderUpdateFetcherRequest = {
    id: string
    status: number
    delivery_status: number
    online_payment_status: number
    comment?: string
}
