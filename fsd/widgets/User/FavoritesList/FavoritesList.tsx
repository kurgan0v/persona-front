"use client";
import s from "./FavoritesList.module.scss";
import ProductCard from "@/fsd/entities/product/components/ProductCard/ProductCard";
import {useMutation} from "react-query";
import {useStore} from "@/fsd/app/hooks/useStore";
import {useFavoritesStore} from "@/fsd/app/store/favorites";
import {useEffect, useState} from "react";
import {GetProductsByIds} from "@/fsd/shared/api/products";
import {IProductDetail} from "@/fsd/entities/product/model";
import Empty from "@/fsd/shared/ui/Empty/Empty";

export default function FavoritesList() {
    const favorites = useStore(useFavoritesStore, (data) => data.favorites)
    const [products, setProducts] = useState<IProductDetail[]>([]);
    const {mutateAsync: getFavorites, isSuccess} = useMutation(GetProductsByIds);
    useEffect(() => {
        if (favorites) {
            getFavorites(favorites).then(setProducts)
        }
    }, [favorites]);
    return (
        <>
            {products.length ? <div className={s.cards}>{products.map(el => (
                <ProductCard product={el} key={el.id}/>
                ))}</div> : <Empty title={"Вы пока ничего не сохранили"}/>}
        </>

    )
}
