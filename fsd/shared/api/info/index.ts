import {$api} from "@/fsd/shared/api/axios";
import {
    IContactsFetcher, IMainSeoFetcher,
    InfoFetcherRequest,
    InfoUpdateFetcherRequest
} from "@/fsd/shared/api/info/types";
import {IInfo} from "@/fsd/entities/info/model";
import {IProduct} from "@/fsd/entities/product/model";

export const InfoFetcher = async (): Promise<InfoFetcherRequest> => {
    const {data} = await $api.get('/info');
    return data;
};
export const InfoAllFetcher = async (): Promise<IInfo[]> => {
    const {data} = await $api.get('/info/all', {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const InfoUpdateFetcher = async (request: InfoUpdateFetcherRequest): Promise<IInfo[]> => {
    const {data} = await $api.post(`/info/update`, request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
}


export const ContactsFetcher = async (): Promise<IContactsFetcher> => {
    const {data} = await $api.get('/contacts', {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};

export const ContactsUpdateFetcher = async (contacts: IContactsFetcher): Promise<void> => {
    const {data} = await $api.post('/contacts/update', contacts,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};

export const MainSeoFetcher = async (): Promise<IMainSeoFetcher> => {
    const {data} = await $api.get('/seo/main', {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const MainSeoUpdateFetcher = async (contacts: IMainSeoFetcher): Promise<void> => {
    const {data} = await $api.post('/seo/main/update', contacts,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
