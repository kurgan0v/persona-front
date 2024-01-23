import {$api} from "@/fsd/shared/api/axios";
import {IProduct, IProductDetail} from "@/fsd/entities/product/model";
import {
    GetProductsFilteredRequest,
    GetProductsFilteredResponse,
    GetProductsQueryFetcherRequest
} from "@/fsd/shared/api/products/types";
import {ICartItem} from "@/fsd/entities/cartItem/model";


export const GetProductsFilteredFetcher = async (request: GetProductsFilteredRequest): Promise<GetProductsFilteredResponse> => {
    const {data} = await $api.post(`/products/filtered`, request);
    return data;
}
export const GetProductsQueryFetcher = async (request: GetProductsQueryFetcherRequest): Promise<IProductDetail[]> => {
    const {data} = await $api.post(`/products_query`, request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
}
export const GetProductFetcher = async (request: string): Promise<IProductDetail> => {
    const {data} = await $api.get(`/products/${request}`);
    return data;
}
export const GetProductDetailFetcher = async (request: string): Promise<IProductDetail> => {
    const {data} = await $api.get(`/products/detail/${request}`);
    return data;
}
export const GetProductsByIds = async (request: string[]): Promise<IProductDetail[]> => {
    const {data} = await $api.post(`/products/ids`, request);
    return data;
}
export const GetCart = async (request: ICartItem[]): Promise<IProductDetail[]> => {
    const {data} = await $api.post(`/products/cart`, {
        items: request
    });
    return data;
}
export const ProductUpdateGalleryFetcher = async (request: {id: string, gallery: string[]}): Promise<void> => {
    const {data} = await $api.post(`/products/update`, request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
}
export const ProductUpdateFetcher = async (request: IProduct): Promise<void> => {
    const {data} = await $api.post(`/products/update`, request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
}
export const ProductCreateFetcher = async (request: IProduct): Promise<IProduct> => {
    const {data} = await $api.post(`/products/create`, request, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
}
export const ProductDeleteFetcher = async (request: string): Promise<void> => {
    const {data} = await $api.delete(`/products/delete/${request}`, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
}
export const ProductCopyFetcher = async (id: string): Promise<{id: string}> => {
    const {data} = await $api.post(`/products/copy`, {id}, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
}
