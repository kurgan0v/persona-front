"use client";
import s from './ProductCard.module.scss';
import Link from "next/link";
import {IProduct, IProductDetail, IProductWithSection} from "@/fsd/entities/product/model";
import FavoriteCatalog from "@/fsd/shared/ui/icons/FavoriteCatalog/FavoriteCatalog";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import {clsx} from "clsx";
import ProductCardBasic from "@/fsd/entities/product/components/ProductCardBasic/ProductCardBasic";
import {useFavoritesStore} from "@/fsd/app/store/favorites";

interface ProductCardProps{
    product: IProductDetail
    section?: string
    category?: string
}
const ProductCard:React.FC<ProductCardProps> = ({product, section, category}) => {
    const favorites = useFavoritesStore((state)=>state.favorites);
    const setFavorites = useFavoritesStore((state)=>state.setFavorites);
    return (
       <div className={s.wrapper}>
           <FavoriteCatalog isActive={favorites.includes(product.id)} onClick={()=>setFavorites(product.id)}/>
           <Link href={
               product.category ?
               `/${product?.category?.section.link}/${product?.category?.link ?? product?.category?.id}/${product.id}` :
                   `/${section}/${category}/${product.id}`
           } >
               <ProductCardBasic product={product}/>
           </Link>
       </div>
    );
};

export default ProductCard;
