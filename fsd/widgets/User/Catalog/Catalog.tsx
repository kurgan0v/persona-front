"use client";
import s from './Catalog.module.scss';
import Filters from "@/fsd/features/Filters/Filters";
import ProductCard from "@/fsd/entities/product/components/ProductCard/ProductCard";
import Empty from "@/fsd/shared/ui/Empty/Empty";
import {useQuery} from "react-query";
import {Breadcrumb, Pagination} from "antd";
import Link from "next/link";
import {useEffect, useState} from "react";
import {IProductDetail} from "@/fsd/entities/product/model";
import {GetCategoryInfoFetcher} from "@/fsd/shared/api/category";
import {motion, useAnimationControls} from 'framer-motion';
import {container, item} from "@/fsd/app/const/framer-motion-options";

export default function Catalog({params, promo}:{params?: { category?: string , section: string}, promo?: string}) {
    const controls = useAnimationControls()
    const [products, setProducts] = useState<IProductDetail[]>([]);
    const [productCount, setProductCount] = useState(0);
    const [currentPage, setCurrentPage] = useState<number|undefined>(undefined);
    const {data, isSuccess, isError} = useQuery([params?.section ?? 'no-section', params?.category ?? 'no-category', promo ?? 'no-promo'], ()=>GetCategoryInfoFetcher({...params, promo}));
    const breadcrumbs = [
        {
            title: <Link href={'/catalog'}>Каталог</Link>,
        },
        {
            title: ((data?.section || data?.promo) && !data.category) ? <p>{data.section ? data.section.name : data.promo?.title}</p> : <Link href={`/catalog/${data?.category?.section?.link}`}>{data?.category?.section?.name}</Link>,
        },
    ];
    if(data?.category?.name){
        breadcrumbs.push({
            title: <p>{data.category.name}</p>,
        })
    }
    useEffect(() => {
        controls.start('visible')
    }, [products.length]);
    return (
        <div>
        {isSuccess && <div className={s.wrapper}>
            {(params || promo) && <Breadcrumb items={breadcrumbs}/>}
            <div className={s.content}>
                <Filters
                    currentPage={currentPage}
                    productCount={productCount}
                    setProductCount={setProductCount}
                    promo={promo}
                    section={params?.section}
                    category={data.category?.id}
                    setProducts={setProducts}
                    characteristics={data?.characteristics}
                    sizes={data.sizes}
                    prices={data.prices[0]}
                    categories={data?.categories}
                />
                <div className={s.list}>
                    <div className={s.header}>
                        <h2>{(data?.section || data?.promo) && !data.category ? data.section ? data.section.name : data.promo?.title : data?.category?.name ?? 'Каталог'}</h2>
                        <p className={s.count}>Найдено: {productCount}</p>
                    </div>
                    <div>{products.length ? <motion.ul animate={controls} variants={container}
                                                  initial="hidden"
                                                  whileInView="visible"  className={s.wrapperProducts}>{products.map(product => (
                        <motion.li variants={item} key={product.id}><ProductCard product={product} section={params?.section ? params.section : product.category?.section.link} category={product.category?.link ? product.category?.link : product.category_id} /></motion.li>
                    ))}</motion.ul> : <Empty title={'Ничего не найдено'}/>}</div>
                    <Pagination hideOnSinglePage current={currentPage} onChange={setCurrentPage} pageSize={15} total={productCount}/>
                </div>
            </div>
        </div>}
        </div>

    )
}
