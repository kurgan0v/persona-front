import {$api} from "@/fsd/shared/api/axios";
import {City, Cost, Point, Region} from "@/fsd/shared/api/cdek/types";

export const GetRegions = async (): Promise<Region[]> => {
    const {data} = await $api.get(`/cdek/regions`);
    return data;
}
export const GetCities = async (region: string): Promise<City[]> => {
    const {data} = await $api.get(`/cdek/cities?region_code=${region}`);
    return data;
}
export const GetDeliveryCost = async (cityCode: number): Promise<Cost[]> => {
    const {data} = await $api.get(`/cdek/delivery_cost?city_code=${cityCode}`);
    return data;
}
export const GetDeliveryPoints = async (cityCode: number): Promise<Point[]> => {
    const {data} = await $api.get(`/cdek/delivery_points?city_code=${cityCode}`);
    return data;
}

