"use client";
import ProductInfo from "@/fsd/entities/product/components/ProductInfo/ProductInfo";
import Link from "next/link";
import {Breadcrumb} from "antd";
import {useQuery} from "react-query";
import {GetProductDetailFetcher} from "@/fsd/shared/api/products";
import {notFound} from "next/navigation";

export default function ProductDetail({productId}: { productId: string }) {
    const {data: product, isSuccess, isError} = useQuery(['product', productId], () => GetProductDetailFetcher(productId))
    return (
        <>
            {isSuccess && <>
                <Breadcrumb items={[
                    {
                        title: <Link href={'/'}>Главная</Link>,
                    },
                    {
                        title: <Link
                            href={`/catalog/${product?.category?.section.link}`}>{product?.category?.section.name}</Link>,
                    },
                    {
                        title: <Link
                            href={`/${product?.category?.section.link}/${product?.category?.link ? product?.category?.link : product?.category?.id}`}>{product?.category?.name}</Link>,
                    },
                    {
                        title: product?.title,
                    },
                ]}/>
                <ProductInfo product={product}/>
            </>}
        </>
    )
}
