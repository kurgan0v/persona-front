"use client";
import s from './CartItem.module.scss';
import {useEffect, useState} from "react";
import {Button} from "antd";
import Minus from "@/fsd/shared/ui/icons/Minus/Minus";
import Plus from "@/fsd/shared/ui/icons/Plus/Plus";
import Delete from "@/fsd/features/Delete/Delete";
import {ICartItem} from "@/fsd/entities/cartItem/model";
import {useCartStore} from "@/fsd/app/store/cart";
import {IProductDetail} from "@/fsd/entities/product/model";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import {clsx} from "clsx";
import Link from "next/link";

export default function CartItem({item, product}: {item: ICartItem, product?: IProductDetail}){
    const cartStore = useCartStore();
    const plus = ()=>{
        cartStore?.increaseValue({product_id: item.product_id, size_id: item.size_id})
    }
    const minus = ()=>{
        cartStore?.decreaseValue({product_id: item.product_id, size_id: item.size_id})
    }
    const deleteItem = () =>{
        cartStore.deleteItem({product_id: item.product_id, size_id: item.size_id})
    }
    const size = product?.sizes.find((el) => el.id === item.size_id)?.ProductSize
    const price = (size?.price
        ? size.price
        : product?.basic_price) || 0;
    const salePrice = product?.sale
        ? product.sale_type === 1
            ? (price * (100 - product.sale) / 100)
            : (price - product.sale)
        : 0;
    const quantity = size?.quantity ?? 0;
    useEffect(() => {
        if(product){
            if(quantity <= (cartStore?.items.find(el => el.product_id === product?.id && el.size_id === item.size_id)?.quantity ?? 1)){
                cartStore.setValue({product_id: item.product_id, size_id: item.size_id}, quantity)
            }
        }
    }, [product]);

    return (
        <div className={s.row}>
            <div className={s.info}>
                <div className={s.image}>
                    <CustomImage src={(product?.gallery && product?.gallery[0]) ? product?.gallery[0] : ''} alt={''} fill/>
                </div>
                <div className={s.textInfo}>
                    <Link href={`/product/${product?.id}`} target={'_blank'}><h3>{product?.title}</h3></Link>
                    <p>Размер: {product?.sizes.find(s => s.id === item.size_id)?.name}</p>
                    {quantity <= 5 && <p className={s.few}>Осталось мало</p>}
                </div>
            </div>
            <div className={s.actions}>
                {quantity > 0 ? <>
                    <div className={s.priceWrapper}>
                        {product?.sale && <span className={s.oldPrice}>{price.toLocaleString()} ₽</span>}
                        <span className={clsx(product?.sale && s.newPrice)}>{product?.sale ? salePrice.toLocaleString() : price.toLocaleString()} ₽</span>
                    </div>
                    <div className={s.quantity}>
                        <Button className={s.quantityAction} onClick={minus}>
                            <Minus/>
                        </Button>
                        <p className={s.quantityNumber}>{item.quantity}</p>
                        <Button className={clsx(s.quantityAction, ((product?.sizes.find((el) => el.id === item.size_id)?.ProductSize?.quantity ?? 0) <= (cartStore?.items.find(el => el.product_id === product?.id && el.size_id === item.size_id)?.quantity ?? 1)) && s.disabledAction)} onClick={plus}>
                            <Plus/>
                        </Button>
                    </div>
                    <p className={clsx(s.price, s.subtotal)}>{((price && item.quantity) && (item.quantity * (salePrice ? salePrice : price)))?.toLocaleString()} ₽</p>
                </> : <p>Данный товар недоступен</p>}
                <Delete className={s.icon} description={'Вы уверены, что хотите удалить этот товар из корзины?'} onConfirm={deleteItem}/>
            </div>
        </div>
    )
}
