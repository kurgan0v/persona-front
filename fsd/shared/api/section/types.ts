import {IPromo} from "@/fsd/entities/promo/model";
import {IProduct, IProductDetail, IProductWithSection} from "@/fsd/entities/product/model";
import {ICategory} from "@/fsd/entities/category/model";

export type SectionUpdateFetcherRequest = {
    id: string
    name?: string
    cover?: string
}

export type SectionFetcherResponse = {
    categories: ICategory[]
    promo: IPromo[]
    popular: IProductDetail[]
}
