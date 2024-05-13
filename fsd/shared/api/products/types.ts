import {IProduct, IProductDetail} from "@/fsd/entities/product/model";
import {ICategory} from "@/fsd/entities/category/model";
import {ISection} from "@/fsd/entities/section/model";
export type GetProductsFilteredResponse = {
    products: IProductDetail[]
    total: number
}
export type GetProductsFilteredRequest = {
    category?: string
    section?: string
    sortType?: string
    is_new?: boolean
    sale?: boolean
    sizes?: string[]
    characteristics?: string[][]
    price?: number[]
    promo?: string
    page?: number | string
}
export type GetProductsQueryFetcherRequest = {
    category: string
    query?: string
}
