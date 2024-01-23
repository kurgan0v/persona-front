"use client";
import {PromoSlider} from "@/fsd/widgets/User/PromoSlider/PromoSlider";
import {ProductSlider} from "@/fsd/widgets/User/ProductSlider/ProductSlider";
import Categories from "@/fsd/widgets/User/Categories/Categories";
import {useQuery} from "react-query";
import {SectionFetcher} from "@/fsd/shared/api/section";
import { notFound } from 'next/navigation'

export default function SectionPage({section}:{section: string}) {
    const {data, isSuccess, isError} = useQuery([section], ()=>SectionFetcher(section))
    if (isError) return notFound();
    return (
        <div>
            {isSuccess && <>
                <PromoSlider promo={data.promo}/>
                {data.popular.length > 0 && <ProductSlider products={data.popular} title={'Популярное'} />}
                <Categories categories={data.categories}/>
            </>}
        </div>
    );
}
