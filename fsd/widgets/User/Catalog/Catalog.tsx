"use client";
import s from './Catalog.module.scss';
import Filters from "@/fsd/features/Filters/Filters";
import ProductCard from "@/fsd/entities/product/components/ProductCard/ProductCard";
import Empty from "@/fsd/shared/ui/Empty/Empty";
import {useQuery} from "react-query";
import {Breadcrumb, Pagination} from "antd";
import Link from "next/link";
import {memo, useEffect, useState} from "react";
import {GetCategoryInfoFetcher} from "@/fsd/shared/api/category";
import {motion, useAnimationControls} from 'framer-motion';
import {container, item} from "@/fsd/app/const/framer-motion-options";
import {IProductDetail} from "@/fsd/entities/product/model";
import {useSearchParams} from "next/navigation";

export const Catalog = ({category, section, promo}: { category?: string, section?: string, promo?: string }) => {
    const searchParams = useSearchParams()
    const initialPage = searchParams.get('page');
    const [page, setPage] = useState(initialPage ? parseInt(initialPage): 1)
    const [productCount, setProductCount] = useState(0)
    const [products, setProducts] = useState<IProductDetail[]>([])
    const controls = useAnimationControls()
    useEffect(() => {
        controls.start('visible')
    }, [products]);
    const {
        data,
        isSuccess,
    } = useQuery([section ?? 'no-section', category ?? 'no-category', promo ?? 'no-promo'], () => GetCategoryInfoFetcher({
        category,
        section,
        promo
    }));
    const breadcrumbs = [
        {
            title: <Link href={'/catalog'}>Каталог</Link>,
        },
        {
            title: ((data?.section || data?.promo) && !data.category) ?
                <p>{data.section ? data.section.name : data.promo?.title}</p> :
                <Link href={`/catalog/${data?.category?.section?.link}`}>{data?.category?.section?.name}</Link>,
        },
    ];
    if (data?.category?.name) {
        breadcrumbs.push({
            title: <p>{data.category.name}</p>,
        })
    }
    return (
        <div className={s.wrapper}>
            {(category || section || promo) && <Breadcrumb items={breadcrumbs}/>}
            <div className={s.content}>
                {isSuccess && <Filters
                    page={page}
                    setPage={setPage}
                    setProducts={setProducts}
                    setProductCount={setProductCount}
                    section={section}
                    category={data?.category?.id}
                    promo={promo}
                    characteristics={data?.characteristics}
                    sizes={data?.sizes}
                    prices={data?.prices[0]}
                    categories={data?.categories}
                />}
                <div className={s.list}>
                    <div className={s.header}>
                        <h2>{(data?.section || data?.promo) && !data.category ? data.section ? data.section.name : data.promo?.title : data?.category?.name ?? 'Каталог'}</h2>
                        <p className={s.count}>Найдено: {productCount}</p>
                    </div>
                    <div>{products.length ? <motion.ul animate={controls} variants={container}
                                                             initial="hidden"
                                                             whileInView="visible"
                                                             className={s.wrapperProducts}>{products.map(product => (
                        <motion.li variants={item} key={product.id}><ProductCard product={product}
                                                                                 section={section ? section : product.category?.section?.link}
                                                                                 category={product.category?.link ? product.category?.link : product.category_id}/>
                        </motion.li>
                    ))}</motion.ul> : <Empty title={'Ничего не найдено'}/>}</div>
                    <Pagination hideOnSinglePage current={page} onChange={setPage} pageSize={15}
                                total={productCount} showSizeChanger={false}/>
                </div>
            </div>
        </div>

    )
}

export default memo(Catalog);
