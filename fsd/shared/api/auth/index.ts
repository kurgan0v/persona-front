import {IDeleteSessionFetcherRequest, ILoginFetcherRequest, ILoginFetcherResponse} from "@/fsd/shared/api/auth/types";
import {$api} from "@/fsd/shared/api/axios";
export const LoginFetcher = async (
    request: ILoginFetcherRequest
): Promise<ILoginFetcherResponse> => {
    const {data} = await $api.post('/login', request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const DeleteSessionFetcher = async (
    request: IDeleteSessionFetcherRequest
): Promise<void> => {
    await $api.delete(`/session/delete/${request.id}`, {
        headers: {
            "authorization": `Bearer ${request.temporaryToken}`
        }
    });
};
export const LogoutFetcher = async (): Promise<void> => {
    await $api.get('/logout');
}
