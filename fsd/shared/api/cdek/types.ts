export interface Region{
    country: string
    country_code: string
    region: string
    region_code: number
}
export interface City{
    code: number
    city: string
    fias_guid?: string
    city_uuid: string
    kladr_code?: string
    country_code?: string
    country: string
    region: string
    region_code: number
    fias_region_guid?: string
    kladr_region_code?: string
    sub_region?: string
    postal_codes?: string[]
    longitude?: number
    latitude?: number
    time_zone?: string
    payment_limit: number
    errors?: {
        code: string
        message: string
    }[]
}
export interface Cost {
    tariff_code: 137 | 368
    tariff_name: string
    tariff_description: string
    delivery_mode: number
    delivery_sum: number
    period_min: number
    period_max: number
}


export interface Point {
    code: string
    name: string
    uuid: string
    address_comment?: string
    nearest_station: string
    work_time: string
    phones: Phone[]
    note?: string
    type: string
    owner_code: string
    take_only: boolean
    is_handout: boolean
    is_reception: boolean
    is_dressing_room: boolean
    is_ltl: boolean
    have_cashless: boolean
    have_cash: boolean
    allowed_cod: boolean
    office_image_list?: OfficeImageList[]
    work_time_list: WorkTimeList[]
    weight_min?: number
    weight_max?: number
    dimensions?: Dimension[]
    location: Location
    fulfillment: boolean
    email?: string
    site?: string
}

export interface Phone {
    number: string
}

export interface OfficeImageList {
    url: string
}

export interface WorkTimeList {
    day: number
    time: string
}

export interface Dimension {
    width: number
    height: number
    depth: number
}

export interface Location {
    country_code: string
    region_code: number
    region: string
    city_code: number
    city: string
    fias_guid: string
    postal_code: string
    longitude: number
    latitude: number
    address: string
    address_full: string
}
