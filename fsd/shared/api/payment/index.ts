import {$api} from "@/fsd/shared/api/axios";
import {IOrder} from "@/fsd/entities/order/model";

export const CheckInvoiceStatus = async (id: string): Promise<IOrder> => {
    const {data} = await $api.get(`/payment/invoice-check-status/${id}`,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    return data;
}
export const GetInvoiceDocument = async (id: string): Promise<Blob> => {
    const {data} = await $api.get(`/payment/get-invoice-document/${id}`,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        responseType: 'blob',
    })
    return data;
}
export const OrderReserve = async (id: number): Promise<void> => {
    const {data} = await $api.get(`/order/reserve/${id}`,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    return data;
}
export const OrderUnreserve = async (id: number): Promise<void> => {
    const {data} = await $api.get(`/order/unreserve/${id}`,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    return data;
}
