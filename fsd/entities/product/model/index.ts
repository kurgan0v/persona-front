import {ICharacteristic, ICharacteristicWithTypeName} from "@/fsd/entities/characteristics/model";
import {ISize} from "@/fsd/entities/size/model";

export interface IProduct{
    id: string
    category_id: string
    gallery: string[]
    description?: string
    title: string
    visible: boolean
    wildberries?: string
    detmir?: string
    is_popular?: boolean
    meta_desc?: string
    basic_price: number
    sale?: number
    sale_type?: number
    is_new?: boolean
    promos?: string[]
    height?: number
    width?: number
    length?: number
    deleted?: boolean
    minPrice?: number
    maxPrice?: number
    seo_title?: string
    vendor_code?: string
}

export interface IProductWithSection extends IProduct{
    category?: {
        id: string
        name: string
        link?: string
        show_size_chart?: boolean
        section: {
            name: string
            id: string
            link: string
        },
        sizes?: ISize[]
    }
}
export interface IProductDetail extends IProductWithSection{
    sizes: ISize[]
    characteristics: ICharacteristicWithTypeName[]
}
