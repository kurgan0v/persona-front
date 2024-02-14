"use client";
import s from './ProductCardAdmin.module.scss';
import Link from "next/link";
import {IProductDetail} from "@/fsd/entities/product/model";
import ProductCardBasic from "@/fsd/entities/product/components/ProductCardBasic/ProductCardBasic";
import {clsx} from "clsx";

interface ProductCardProps{
    product: IProductDetail
}
const ProductCardAdmin:React.FC<ProductCardProps> = ({product}) => {
    return (
       <div className={clsx(s.wrapper, !product.visible && s.hidden)}>
           <Link href={`/admin/product/${product.id}`} target={'_blank'}>
               <ProductCardBasic product={product}/>
           </Link>
       </div>
    );
};

export default ProductCardAdmin;
