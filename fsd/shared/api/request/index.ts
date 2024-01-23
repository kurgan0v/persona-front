import {$api} from "@/fsd/shared/api/axios";
import {
    RequestsFetcherRequest,
    RequestsFetcherResponse,
    RequestUpdateFetcherRequest
} from "@/fsd/shared/api/request/types";

export const RequestCreateFetcher = async (request: FormData): Promise<void> => {
    const {data} = await $api.post('/requests/create', request, {
        headers: {
            "Content-type": "multipart/form-data",
        }
    });
    return data;
};
export const RequestsFetcher = async (request: RequestsFetcherRequest): Promise<RequestsFetcherResponse> => {
    const {data} = await $api.post('/requests', request,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const RequestUpdateFetcher = async (request: RequestUpdateFetcherRequest): Promise<void> => {
    const {data} = await $api.post('/requests/update', request,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
