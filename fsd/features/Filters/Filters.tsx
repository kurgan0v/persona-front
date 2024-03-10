"use client";
import s from './Filters.module.scss';
import {Badge, Col, Collapse, CollapseProps, Form, Row, Select, Slider, Switch} from "antd";
import {CaretDownFilled, CaretRightOutlined} from "@ant-design/icons";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {ICharacteristicType} from "@/fsd/entities/characteristics/model";
import {ISize} from "@/fsd/entities/size/model";
import {useMutation, useQuery} from "react-query";
import {GetProductsFilteredFetcher} from "@/fsd/shared/api/products";
import {IProduct, IProductDetail} from "@/fsd/entities/product/model";
import useCustomDebounce from "@/fsd/shared/hooks/useCustomDebounce";
import {clsx} from "clsx";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {SectionsFetcher} from "@/fsd/shared/api/section";
import {ICategory} from "@/fsd/entities/category/model";

interface FiltersProps {
    currentPage: number | undefined
    productCount: number
    setProductCount: React.Dispatch<React.SetStateAction<number>>
    category?: string
    section?: string
    characteristics: ICharacteristicType[]
    sizes: ISize[]
    setProducts: React.Dispatch<React.SetStateAction<IProductDetail[]>>
    prices: {
        min: number | null
        max: number | null
    }
    categories?: ICategory[]
    promo?: string
}

export default function Filters({currentPage, productCount, setProductCount, characteristics, sizes, prices, setProducts, category, section, categories, promo}: FiltersProps) {

    const searchParams = useSearchParams()
    const urlCh = searchParams.get('characteristics');
    const urlSizes = searchParams.get('sizes');
    const urlPrices = searchParams.get('prices');
    const {data: sections, isSuccess: isSuccessSections} = useQuery(['sections'], SectionsFetcher);
    const newPrices = urlPrices?.split(',').map(el => +el).slice(0,2);
    const {mutateAsync: getProducts} = useMutation(GetProductsFilteredFetcher);
    const [filterCount, setFilterCount] = useState(0);
    const [sortType, setSortType] = useState(searchParams.get('sort') ?? 'name');
    const [onlyNew, setOnlyNew] = useState(!!searchParams.get('new'));
    const [onlySale, setOnlySale] = useState(!!searchParams.get('sale'));
    const [productCharacteristics, setProductCharacteristics] = useState<string[][]>(urlCh ? urlCh.split(':').map((t)=> t ? t.split(',') : []) : []);
    const [productSizes, setProductSizes] = useState<string[]>(urlSizes ? urlSizes.split(',') : []);
    const [price, setPrice] = useState<number[]>(newPrices ? [newPrices[0] ?? prices.min, newPrices[1] ?? prices.max] : [prices.min ?? 0, prices.max ?? 0])
    const [debouncedPrice] = useCustomDebounce(price, 500);
    useEffect(() => {
        if(prices.max && ((price[0] !== prices.min || price[1] !== prices.max) || searchParams.get('prices'))){
            router.push(pathname + '?' + createQueryString('prices', debouncedPrice.join(',')))
        }
    }, [debouncedPrice]);
    useEffect(() => {
        if(currentPage){
            router.push(pathname + '?' + createQueryString('page', `${currentPage}`))
        }
    }, [currentPage]);
    const router = useRouter();
    const pathname = usePathname();
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams)
            if(value){
                params.set(name, value)
            } else {
                params.delete(name)
            }
            return params.toString()
        },
        [searchParams]
    )
    const choseSize = (e: string) => {
        let newSizes:string[] = [];
        if(!productSizes.includes(e)){
            newSizes = [...productSizes, e]
        } else{
            newSizes = productSizes.filter(s => s !== e)
        }
        setProductSizes(newSizes)
        router.push(pathname + '?' + createQueryString('sizes', newSizes.join(',')))
    }
    const choseCharacteristic = (e: string, i: number) => {
        let newCharacteristics: string[][] = JSON.parse(JSON.stringify(productCharacteristics))
        if(newCharacteristics[i]){
            if(!newCharacteristics[i].includes(e)){
                newCharacteristics[i] = [...newCharacteristics[i], e];
            }else{
                newCharacteristics[i] = newCharacteristics[i].filter(s => s !== e)
            }
        } else {
            newCharacteristics[i] = [e];
        }
        router.push(pathname + '?' + createQueryString('characteristics', newCharacteristics.map((ch)=>ch ? ch.join(',') : '').join(':')))
        setProductCharacteristics(newCharacteristics)
    }
    useEffect(() => {
        getProducts({
            category,
            section,
            sortType,
            promo: promo,
            is_new: onlyNew,
            sale: onlySale,
            sizes: productSizes,
            characteristics: productCharacteristics,
            price: debouncedPrice,
            page: currentPage
        }).then((res)=>{
            setProducts(res.products)
            setProductCount(res.total)
            setFilterCount(+onlyNew + +onlySale + +!!productSizes.length + productCharacteristics.filter(c => c != undefined && c.length).length + +(!!prices.min && (debouncedPrice[0] !== prices.min || debouncedPrice[1] !== prices.max)))
        })
    }, [searchParams]);
    const filters = characteristics ? [
        ...characteristics.map((ch) => (
            {
                name: ch.name,
                options: ch.characteristics.map((c) => (
                    {
                        id: c.id,
                        name: c.name
                    }
                ))
            }
        )),

    ] : [];
    const resetFilters = ()=>{
        setOnlySale(false);
        setOnlyNew(false);
        setProductCharacteristics([]);
        setProductSizes([])
        setPrice([prices.min ?? 0, prices.max ?? 0])
        router.push(pathname)
    }
    const items: CollapseProps['items'] = [
        ...filters.map((f,i) => {
            return {
                key: f.name,
                label: f.name,
                className: clsx(s.collapse, productCharacteristics[i]?.length && s.activeCollapse),
                children: <div className={s.filterOptions}>
                    {f.options.map(opt => (
                        <div key={opt.id} className={clsx(productCharacteristics[i]?.includes(opt.id) && s.active, s.filterOption)} onClick={()=>choseCharacteristic(opt.id, i)}>{opt.name}</div>
                    ))}
                </div>,
            }
        }),

    ];
    if(category){
       items.push({
           key: 'sizes',
           label: 'Размеры',
           className: clsx(s.collapse, productSizes.length && s.activeCollapse),
           children: sizes?.length ? <div className={s.filterOptions}>
               {sizes.map((size) => (
                   <div key={size.id} className={clsx(productSizes.includes(size.id) && s.active, s.filterOption)} onClick={()=>choseSize(size.id)}>{size.name}</div>
               ))}
           </div> : <p>Размеры не найдены</p>
       })
    }
    if(prices.min !== prices.max){
        items.push({
            key: 'price',
            label: 'Стоимость',
            className: clsx(s.collapse, prices.min && (debouncedPrice[0] !== prices.min || debouncedPrice[1] !== prices.max) && s.activeCollapse),
            children: prices.min ? <div className={s.priceFilter}>
                <Slider range step={10} min={prices.min ?? 0}
                        max={prices.max ?? 0} value={price} onChange={setPrice}/>
                <div className={s.price}>
                    <p>{price[0]}₽</p>
                    <p>{price[1]}₽</p>
                </div>
            </div>: <p>Поиск по цене недоступен</p>
        })
    }
    const sectionsList = useMemo(()=>{
        let filteredSections = []
        if(sections){
            for(let el of sections){
                if (el.is_uni && !el.sections.length) continue;
                if(el.sections.length){
                    for(let section of el.sections){
                        filteredSections.push({
                            value: section.link,
                            label: section.name
                        })
                    }
                } else {
                    filteredSections.push({
                        value: el.link,
                        label: el.name
                    })
                }
            }
        }
        return filteredSections;
    }, [sections])
    return (
        <div className={s.options}>

            <div className={s.filterType}>
                <h3>Сортировка</h3>
                <Select
                    defaultValue="name"
                    value={sortType}
                    onChange={(e)=>{
                        setSortType(e)
                        router.push(pathname + '?' + createQueryString('sort', e))
                    }}
                    style={{width: '100%', height: 'auto'}}
                    suffixIcon={<CaretDownFilled/>}
                    options={[
                        {value: 'name', label: 'По названию'},
                        {value: 'asc', label: 'По возрастанию цены'},
                        {value: 'desc', label: 'По убыванию цены'},
                    ]}/>
            </div>
            {!category && !section && !promo && <div className={s.filterType}>
                <h3>Раздел</h3>
                <Select
                    placeholder={'не выбрано'}
                    style={{width: '100%', height: 'auto'}}
                    suffixIcon={<CaretDownFilled/>}
                    options={sectionsList}
                    onChange={(el)=>{
                        router.push(`/catalog/${el}`)
                    }}
                />

            </div>}
            {!category && section && !promo && <div className={s.filterType}>
                <h3>Категория</h3>
                <Select
                    placeholder={'не выбрано'}
                    style={{width: '100%', height: 'auto'}}
                    suffixIcon={<CaretDownFilled/>}
                    options={categories?.map(el => (
                        {
                            label: el.name,
                            value: el.link ? el.link : el.id,
                            section_link: el.section?.link ?? ''
                        }
                    ))}
                    onChange={(value, origin)=>{
                        router.push(`/${Array.isArray(origin) ? origin[0].section_link : origin.section_link}/${value}`)
                    }}
                />
            </div>}
            <div className={s.filterType}>
                <div className={s.filters}>
                    <div className={s.filterHeader}>
                        <h3>Фильтры</h3>
                        <Badge count={filterCount}></Badge>
                    </div>
                    <p className={s.clear} onClick={resetFilters}>Сбросить</p>
                </div>
                <div className={s.flags}>
                    <div className={s.flag}>
                        <Switch checked={onlyNew} onChange={(e)=>{
                            setOnlyNew(e)
                            router.push(pathname + '?' + createQueryString('new', e ? "1" : ''))
                        }}/>
                        <p>Новинка</p>
                    </div>
                    <div className={s.flag}>
                        <Switch checked={onlySale} onChange={(e)=>{
                            setOnlySale(e)
                            router.push(pathname + '?' + createQueryString('sale', e ? "1" : ''))
                        }}/>
                        <p>Есть скидка</p>
                    </div>
                </div>
                <Collapse items={items} bordered={false}
                          expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}/>
            </div>
        </div>
    )
}
