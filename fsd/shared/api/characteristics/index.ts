import {$api} from "@/fsd/shared/api/axios";
import {ICharacteristicType} from "@/fsd/entities/characteristics/model";
import {
    CharacteristicsProductUpdateFetcherRequest,
    CharacteristicsTypeCreateFetcherRequest,
    CharacteristicCreateFetcherRequest
} from "@/fsd/shared/api/characteristics/types";

export const CharacteristicsByCategoryFetcher = async (category: string): Promise<ICharacteristicType[]> => {
    const {data} = await $api.get(`/characteristics/category/${category}`, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const CharacteristicsTypeCreateOrUpdateFetcher = async (request: CharacteristicsTypeCreateFetcherRequest): Promise<void> => {
    const {data} = await $api.post(`/characteristics/create_or_update/type`, request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const CharacteristicCreateOrUpdateFetcher = async (request: CharacteristicCreateFetcherRequest): Promise<void> => {
    const {data} = await $api.post(`/characteristics/create_or_update/characteristic`, request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const CharacteristicsProductUpdateFetcher = async (request: CharacteristicsProductUpdateFetcherRequest): Promise<void> => {
    const {data} = await $api.post(`/characteristics/update/product`, request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const CharacteristicsTypeDeleteFetcher = async (request: string): Promise<void> => {
    const {data} = await $api.delete(`/characteristics/delete/type/${request}`, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const CharacteristicDeleteFetcher = async (request: string): Promise<void> => {
    const {data} = await $api.delete(`/characteristics/delete/characteristic/${request}`, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
