import {ICategory} from "@/fsd/entities/category/model";
import {ISection} from "@/fsd/entities/section/model";
import {GetCategoryInfoFetcher} from "@/fsd/shared/api/category/index";
import {ICharacteristicType} from "@/fsd/entities/characteristics/model";
import {ISize} from "@/fsd/entities/size/model";
import {IPromo} from "@/fsd/entities/promo/model";

export type CategoryUpdateCreateFetcherRequest = {
    id?: string
    name?: string
    cover?: string
    visible?: boolean
    section_id?: string
}
export type GetCategoryInfoFetcherRequest = {
    category?: string
    section?: string
    promo?: string
}
interface DetailCategory extends ICategory{
    section?: ISection
}
export type GetCategoryInfoFetcherResponse = {
    category: DetailCategory,
    characteristics: ICharacteristicType[]
    sizes: ISize[]
    prices: [{
        min: number | null
        max: number | null
    }]
    section?: ISection
    categories: ICategory[]
    promo?: IPromo
}
