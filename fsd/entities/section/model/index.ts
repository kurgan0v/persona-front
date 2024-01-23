export interface ISection {
    id: string
    name: string
    cover?: string
    is_main: boolean
    link?: string
    order?: number
    seo_title?: string
    seo_description?: string
    seo_keywords?: string
}
export interface ISectionView extends ISection{
    sections: ISection[]
}
