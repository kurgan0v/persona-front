
export interface ICategory{
    id: string
    name: string
    section_id: string
    cover: string
    text?: string
    link: string
    visible?: boolean
    show_size_chart?: boolean
    seo_title?: string
    seo_description?: string
    seo_keywords?: string
    section?: {
        link: string
        is_uni?: boolean
    }
}
