import {$api} from "@/fsd/shared/api/axios";
import {ISize} from "@/fsd/entities/size/model";
import {SizesCreateFetcherRequest} from "@/fsd/shared/api/size/types";
import {CharacteristicsProductUpdateFetcherRequest} from "@/fsd/shared/api/characteristics/types";

export const SizesByCategoryFetcher = async (category: string): Promise<ISize[]> => {
    const {data} = await $api.get(`/size/category/${category}`, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const SizesCreateOrUpdateFetcher = async (request: SizesCreateFetcherRequest): Promise<void> => {
    const {data} = await $api.post(`/size/create_or_update`, request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const SizesProductUpdateFetcher = async (request: CharacteristicsProductUpdateFetcherRequest): Promise<void> => {
    const {data} = await $api.post(`/size/update/product`, request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const SizeDeleteFetcher = async (request: string): Promise<void> => {
    const {data} = await $api.delete(`/size/delete/${request}`, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const UpdateSizesOrderFetcher = async (request: ISize[]): Promise<void> => {
    const {data} = await $api.post(`/size/update_order`, request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
