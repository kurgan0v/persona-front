"use client";
import AddIcon from "@/fsd/shared/ui/icons/AddIcon/AddIcon";
import s from './ProductsList.module.scss';
import {useEffect, useState} from "react";
import {useMutation, useQuery} from "react-query";
import {SectionsAllFetcher} from "@/fsd/shared/api/section";
import {Button, Input, Select} from "antd";
import {CategoriesFetcher} from "@/fsd/shared/api/category";
import {GetProductsQueryFetcher} from "@/fsd/shared/api/products";
import {IProduct, IProductDetail} from "@/fsd/entities/product/model";
import ProductCardAdmin from "@/fsd/entities/product/components/ProductCardAdmin/ProductCardAdmin";
import Empty from "@/fsd/shared/ui/Empty/Empty";
import {CaretDownFilled} from "@ant-design/icons";
import useCustomDebounce from "@/fsd/shared/hooks/useCustomDebounce";
import {clsx} from "clsx";
import Link from "next/link";
import {ICategory} from "@/fsd/entities/category/model";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

type Params = {
    params?: {
        category?: string
        section?: string
    }
}
export default function ProductsList({params}: Params) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [section, setSection] = useState(params?.section);
    const [category, setCategory] = useState(params?.category);
    const [products, setProducts] = useState<IProductDetail[] | undefined>();
    const [categories, setCategories] = useState<ICategory[] | undefined>();
    const [query, setQuery] = useState(searchParams.get('q') ?? '');
    const [debouncedSearchQuery] = useCustomDebounce(query, 500);
    useEffect(() => {
        if (debouncedSearchQuery) {
            router.push(`${pathname}/?q=${debouncedSearchQuery}`);
            getProducts({
                category: category ?? '',
                query: debouncedSearchQuery
            }).then(r => setProducts(r))
        } else {
            router.push(`${pathname}`);
        }
    }, [debouncedSearchQuery]);
    useEffect(() => {
        if (section) {
            getCategories(section).then(r => setCategories(r))
        }
    }, [section]);
    useEffect(() => {
        if(category){
            getProducts({
                category,
                query
            }).then(r => setProducts(r))
        }
    }, [category]);
    const {
        data: sections,
        isSuccess
    } = useQuery(['sections_all'], SectionsAllFetcher);
    const {mutateAsync: getCategories} = useMutation(CategoriesFetcher);
    const {mutateAsync: getProducts} = useMutation(GetProductsQueryFetcher);
    const {Option} = Select;
    return (
        <div className={s.wrapper}>
            <div className={s.header}>
                <h2>Товары</h2>
                <Link href={'/admin/product/create'}><AddIcon/></Link>
            </div>
            <div className={s.filters}>
                <div className={clsx(s.sectionFilter, s.input)}>
                    <p>Поиск по названию</p>
                    <Input className={s.searchInput} onChange={(e) => setQuery(e.target.value)} value={query}
                           placeholder={'Рубашка белая'}/>
                </div>
                <div className={s.sections}>
                    <div className={s.sectionFilter}>
                        <p>Раздел</p>
                        {isSuccess && <Select
                            suffixIcon={<CaretDownFilled/>}
                            className={s.sectionSelect}
                            allowClear
                            onClear={()=>router.push(`/admin/products/?q=${debouncedSearchQuery}`)}
                            placeholder={'Выберите раздел'}
                            value={section} onChange={(e) => {
                            if(e){
                                router.push(`/admin/products/${e}/?q=${debouncedSearchQuery}`)
                            }
                        }}>{
                            sections.map(el => (
                                <Option key={el.id} value={el.id}>{el.name}</Option>
                            ))
                        }
                        </Select>}
                    </div>
                    {categories && <div className={s.sectionFilter}>
                        <p>Категория</p>
                        <Select
                            suffixIcon={<CaretDownFilled/>} className={s.sectionSelect}
                            allowClear
                            value={category}
                            onClear={()=>{
                                if(section){
                                    router.push(`/admin/products/${section}/?q=${debouncedSearchQuery}`)
                                }
                            }}
                            placeholder={'Выберите категорию'} onChange={(e) => {
                            if(section && e){
                                router.push(`/admin/products/${section}/${e}/?q=${debouncedSearchQuery}`)
                            }
                        }}>
                            {categories.map(el => (
                                <Option key={el.id} value={el.id}>{el.name}</Option>
                            ))}
                        </Select>
                    </div>}
                </div>
            </div>
            {((query || category) && products) ?
                <>
                    {products.length ? <div className={s.products}>{products.map(product => (
                        <ProductCardAdmin product={product} key={product.id}/>
                    ))}</div> : <Empty
                        title={query ? 'По вашему запросу ничего не найдено' : 'В этой категории пока нет продуктов'}/>}
                </> : <p>Введите поисковый запрос или выберите категорию</p>
            }
        </div>
    )
}
