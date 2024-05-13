"use client";
import s from './Filters.module.scss';
import {Badge, Collapse, CollapseProps, Select, Slider, Switch} from "antd";
import {CaretDownFilled, CaretRightOutlined} from "@ant-design/icons";
import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {ICharacteristicType} from "@/fsd/entities/characteristics/model";
import {ISize} from "@/fsd/entities/size/model";
import {useQuery} from "react-query";
import {GetProductsFilteredFetcher} from "@/fsd/shared/api/products";
import {clsx} from "clsx";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {SectionsFetcher} from "@/fsd/shared/api/section";
import {ICategory} from "@/fsd/entities/category/model";
import Link from "next/link";
import {IProductDetail} from "@/fsd/entities/product/model";

interface FiltersProps {
    category?: string
    section?: string
    promo?: string
    characteristics: ICharacteristicType[]
    sizes: ISize[]
    prices: {
        min: number | null
        max: number | null
    }
    categories?: ICategory[]
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    setProducts: React.Dispatch<React.SetStateAction<IProductDetail[]>>
    setProductCount: React.Dispatch<React.SetStateAction<number>>
}

export const Filters = ({
                            page,
                            setPage,
                            setProductCount,
                            setProducts,
                            category,
                            section,
                            promo,
                            characteristics,
                            sizes,
                            prices,
                            categories}: FiltersProps) => {
    const searchParams = useSearchParams()
    const urlPrices = searchParams.get('prices');
    const newPrices = urlPrices?.split(',').map(el => +el).slice(0, 2);
    const [price, setPrice] = useState<number[]>(newPrices ? [newPrices[0] ?? prices.min, newPrices[1] ?? prices.max] : [prices.min ?? 0, prices.max ?? 0])
    const urlCh = searchParams.get('characteristics');
    const urlSizes = searchParams.get('sizes');
    const {data: sections} = useQuery(['sections'], SectionsFetcher);
    const {} = useQuery([], () => GetProductsFilteredFetcher({
        category,
        section,
        promo,
        price: price,
        page: page,
        is_new: onlyNew,
        sale: onlySale,
        sizes: productSizes,
        sortType,
        characteristics: productCharacteristics
    }).then((res) => {
        setProducts(res.products)
        setProductCount(res.total)
        setFilterCount(+onlyNew + +onlySale + +!!productSizes.length + productCharacteristics.filter(c => c != undefined && c.length).length + +(!!prices.min && (price[0] !== prices.min || price[1] !== prices.max)))
    }));

    const [filterCount, setFilterCount] = useState(0);
    const [sortType, setSortType] = useState(searchParams.get('sort') ?? 'name');
    const [onlyNew, setOnlyNew] = useState(!!searchParams.get('new'));
    const [onlySale, setOnlySale] = useState(!!searchParams.get('sale'));
    const [productCharacteristics, setProductCharacteristics] = useState<string[][]>(urlCh ? urlCh.split(':').map((t) => t ? t.split(',') : []) : []);
    const [productSizes, setProductSizes] = useState<string[]>(urlSizes ? urlSizes.split(',') : []);
    useEffect(() => {
        if(page > 1){
            router.push(pathname + '?' + createQueryString({name: 'page', value: `${page}`}))
        }
        if(page === 1 && searchParams.get('page')){
            router.push(pathname + '?' + createQueryString({name: 'page', value: ""}))
        }
    }, [page]);

    const router = useRouter();
    const pathname = usePathname();
    const createQueryString = useCallback(
        (param: { name: string, value: string }, resetPage?: boolean) => {
            const params = new URLSearchParams(searchParams)
            if (resetPage) {
                params.delete('page')
            }
            if (param.value) {
                params.set(param.name, param.value)
            } else {
                params.delete(param.name)
            }
            return params.toString()
        },
        [searchParams]
    )
    const choseSize = (e: string) => {
        let newSizes: string[] = [];
        if (!productSizes.includes(e)) {
            newSizes = [...productSizes, e]
        } else {
            newSizes = productSizes.filter(s => s !== e)
        }
        setProductSizes(newSizes)
        router.push(pathname + '?' + createQueryString({name: 'sizes', value: newSizes.join(',')}, true))
    }
    const choseCharacteristic = (e: string, i: number) => {
        let newCharacteristics: string[][] = JSON.parse(JSON.stringify(productCharacteristics))
        if (newCharacteristics[i]) {
            if (!newCharacteristics[i].includes(e)) {
                newCharacteristics[i] = [...newCharacteristics[i], e];
            } else {
                newCharacteristics[i] = newCharacteristics[i].filter(s => s !== e)
            }
        } else {
            newCharacteristics[i] = [e];
        }
        router.push(pathname + '?' + createQueryString({name: 'characteristics', value: newCharacteristics.map((ch)=>ch ? ch.join(',') : '').join(':')}, true))
        setProductCharacteristics(newCharacteristics)
    }
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
    const resetFilters = () => {
        setOnlySale(false);
        setOnlyNew(false);
        setProductCharacteristics([]);
        setProductSizes([])
        setPrice([prices.min ?? 0, prices.max ?? 0])
        router.push(pathname)
    }
    const activeKeys = [];
    const items: CollapseProps['items'] = [
        ...filters.map((f, i) => {
            if(productCharacteristics[i]?.length){
                activeKeys.push(f.name)
            }
            return {
                key: f.name,
                label: f.name,
                className: clsx(s.collapse, productCharacteristics[i]?.length && s.activeCollapse),
                children: <div className={s.filterOptions}>
                    {f.options.map(opt => (
                        <div key={opt.id}
                             className={clsx(productCharacteristics[i]?.includes(opt.id) && s.active, s.filterOption)}
                             onClick={() => choseCharacteristic(opt.id, i)}>{opt.name}</div>
                    ))}
                </div>,
            }
        }),
    ];
    if (category) {
        if(productSizes.length){
            activeKeys.push('sizes')
        }
        items.push({
            key: 'sizes',
            label: 'Размеры',
            className: clsx(s.collapse, productSizes.length && s.activeCollapse),
            children: sizes?.length ? <div className={s.filterOptions}>
                {sizes.map((size) => (
                    <div key={size.id} className={clsx(productSizes.includes(size.id) && s.active, s.filterOption)}
                         onClick={() => choseSize(size.id)}>{size.name}</div>
                ))}
            </div> : <p>Размеры не найдены</p>
        })
    }
    if (prices.min !== prices.max) {
        if(prices.min && (price[0] !== prices.min || price[1] !== prices.max)){
            activeKeys.push('price')
        }
        items.push({
            key: 'price',
            label: 'Стоимость',
            className: clsx(s.collapse, prices.min && (price[0] !== prices.min || price[1] !== prices.max) && s.activeCollapse),
            children: prices.min ? <div className={s.priceFilter}>
                <Slider range step={10} min={prices.min ?? 0}
                        max={prices.max ?? 0} value={price} onChange={setPrice} onChangeComplete={(e)=>{
                    if (prices.max && ((price[0] !== prices.min || price[1] !== prices.max) || urlPrices)) {
                        router.push(pathname + '?' + createQueryString({name: 'prices', value: e.join(',')}, true))
                    }
                }}/>
                <div className={s.price}>
                    <p>{price[0]}₽</p>
                    <p>{price[1]}₽</p>
                </div>
            </div> : <p>Поиск по цене недоступен</p>
        })
    }
    const sectionsList = useMemo(() => {
        let filteredSections = []
        if (sections) {
            for (let el of sections) {
                if (el.is_uni && !el.sections.length) continue;
                if (el.sections.length) {
                    for (let section of el.sections) {
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
                    onChange={(e) => {
                        setSortType(e)
                        router.push(pathname + '?' + createQueryString({name: 'sort', value: e}, true))
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
                    popupClassName={s.selectLinks}
                    placeholder={'не выбрано'}
                    style={{width: '100%', height: 'auto'}}
                    suffixIcon={<CaretDownFilled/>}
                    options={sectionsList}
                    optionRender={(option) => (
                        <Link className={s.selectLink} href={`/catalog/${option.value}`}>
                            {option.label}
                        </Link>
                    )}
                />

            </div>}
            {!category && section && !promo && <div className={s.filterType}>
                <h3>Категория</h3>
                <Select
                    placeholder={'не выбрано'}
                    popupClassName={s.selectLinks}
                    style={{width: '100%', height: 'auto'}}
                    suffixIcon={<CaretDownFilled/>}
                    options={categories?.map(el => (
                        {
                            label: el.name,
                            value: el.link ? el.link : el.id,
                            section_link: el.section?.link ?? ''
                        }
                    ))}
                    optionRender={(option) => (
                        <Link className={s.selectLink} href={`/${option.data.section_link}/${option.value}`}>
                            {option.label}
                        </Link>
                    )}

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
                        <Switch checked={onlyNew} onChange={(e) => {
                            setOnlyNew(e)
                            router.push(pathname + '?' + createQueryString({name: 'new', value: e ? "1" : ''}, true))
                        }}/>
                        <p>Новинка</p>
                    </div>
                    <div className={s.flag}>
                        <Switch checked={onlySale} onChange={(e) => {
                            setOnlySale(e)
                            router.push(pathname + '?' + createQueryString({name: 'sale', value: e ? "1" : ''}, true))
                        }}/>
                        <p>Есть скидка</p>
                    </div>
                </div>
                <Collapse items={items} bordered={false} defaultActiveKey={activeKeys}
                          expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}/>
            </div>
        </div>
    )
}

export default memo(Filters)
