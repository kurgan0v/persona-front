import {$api} from "@/fsd/shared/api/axios";
import {
    CategoryUpdateCreateFetcherRequest,
    GetCategoryInfoFetcherRequest,
    GetCategoryInfoFetcherResponse
} from "@/fsd/shared/api/category/types";
import {ICategory} from "@/fsd/entities/category/model";


export const GetCategoryInfoFetcher = async (request?: GetCategoryInfoFetcherRequest): Promise<GetCategoryInfoFetcherResponse> => {
    const {data} = await $api.post(`/categories/info`, request);
    return data;
}
export const CategoriesFetcher = async (sectionId: string): Promise<ICategory[]> => {
    const {data} = await $api.get(`/categories/${sectionId}`,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};
export const CategoryCreateFetcher = async (request: CategoryUpdateCreateFetcherRequest) => {
    const {data} = await $api.post('/categories/create', request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    return data;
}
export const CategoryUpdateFetcher = async (request: CategoryUpdateCreateFetcherRequest) => {
    const {data} = await $api.post('/categories/update', request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    return data;
}

export const CategoriesDeleteFetcher = async (categoryId: string): Promise<ICategory[]> => {
    const {data} = await $api.delete(`/categories/delete/${categoryId}`,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};

