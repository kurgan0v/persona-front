import {$api} from "@/fsd/shared/api/axios";
import {IOrder} from "@/fsd/entities/order/model";
import {
    IOrderNew,
    OrdersFetcherRequest,
    OrdersFetcherResponse,
    OrderUpdateFetcherRequest
} from "@/fsd/shared/api/order/types";
import {ICartItem} from "@/fsd/entities/cartItem/model";

export const CreateOrderFetcher = async ({order, items}: {order: IOrderNew, items: ICartItem[]}): Promise<IOrder> => {
    const {data} = await $api.post('/order/create', {order, items});
    return data;
};
export const OrdersFetcher = async (request: OrdersFetcherRequest): Promise<OrdersFetcherResponse> => {
    const {data} = await $api.post('/order/all', request,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const OrderUpdateFetcher = async (request: OrderUpdateFetcherRequest): Promise<void> => {
    const {data} = await $api.post('/order/update', request,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
