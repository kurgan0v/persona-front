import {$api} from "@/fsd/shared/api/axios";
import {IPromo} from "@/fsd/entities/promo/model";
import {CreateOrUpdatePromoFetcherResponse} from "@/fsd/shared/api/promo/types";


export const PromosFetcher = async (): Promise<IPromo[]> => {
    const {data} = await $api.get(`/promo/all`,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const CreateOrUpdatePromoFetcher = async (request: CreateOrUpdatePromoFetcherResponse): Promise<IPromo[]> => {
    const {data} = await $api.post('/promo/create_or_update', request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    return data;
}

export const DeletePromoFetcher = async (id: string): Promise<IPromo[]> => {
    const {data} = await $api.delete(`/promo/delete/${id}`,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const UpdatePromoOrderFetcher = async (request: CreateOrUpdatePromoFetcherResponse[]): Promise<IPromo[]> => {
    const {data} = await $api.post(`/promo/update_order`, request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
