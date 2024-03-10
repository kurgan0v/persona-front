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
import { motion } from "framer-motion";
import {container, item} from "@/fsd/app/const/framer-motion-options";

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
            {products?.length > 0 ? <motion.ul className={s.cards} variants={container}
                                               initial="hidden"
                                               whileInView="visible" viewport={{ once: true }}>
                {products.length > 0 && products.map(el => (
                    <motion.li key={el.id} variants={item}><ProductCard product={el} /></motion.li>
                ))}
                {favoritesFiltered.map(el =>
                    <motion.li key={el} variants={item}><ProductCard
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

                    /></motion.li>)}
            </motion.ul> : <Empty title={"Вы пока ничего не сохранили"}/>}
        </>

    )
}
