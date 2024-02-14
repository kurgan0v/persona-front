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
    const [favoritesFiltered, setFavoritesFiltered] = useState<string[]>([]);
    const {mutateAsync: getFavorites, isSuccess} = useMutation(GetProductsByIds);
    useEffect(() => {
        if (favorites && !products.length) {
            getFavorites(favorites).then(r => {
                setProducts(r)
                setFavoritesFiltered(favorites.filter(el => !r.find(p => p.id === el)))
            })

        }
    }, [favorites]);
    return (
        <>
            {favorites?.length ? <div className={s.cards}>
                {products.length > 0 && products.map(el => (
                    <ProductCard product={el} key={el.id}/>
                ))}
                {favoritesFiltered.map(el =>
                    <ProductCard
                        product={{
                            id: el,
                            title: 'Товар недоступен',
                            sizes: [],
                            gallery: [],
                            characteristics: [],
                            category_id: '',
                            basic_price: 0,
                            visible: true
                        }}
                        key={el}
                    />)}
            </div> : <Empty title={"Вы пока ничего не сохранили"}/>}
        </>

    )
}
