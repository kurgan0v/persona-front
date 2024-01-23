import {ISection, ISectionView} from "@/fsd/entities/section/model";
import {$api} from "@/fsd/shared/api/axios";
import {SectionFetcherResponse, SectionUpdateFetcherRequest} from "@/fsd/shared/api/section/types";
export const SectionsFetcher = async (): Promise<ISectionView[]> => {
    const {data} = await $api.get('/sections');
    return data;
};
export const SectionsAllFetcher = async (): Promise<ISection[]> => {
    const {data} = await $api.get('/sections_all', {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const SectionFetcher = async (section: string): Promise<SectionFetcherResponse> => {
    const {data} = await $api.get(`/section/${section}`);
    return data;
};
export const SectionUpdateFetcher = async (request: SectionUpdateFetcherRequest) => {
    const {data} = await $api.post('/section/update', request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    return data;
}
