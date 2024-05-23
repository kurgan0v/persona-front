"use client";
import s from './CartItems.module.scss';
import CartItem from "@/fsd/entities/orderItem/components/CartItem/CartItem";
import {useStore} from "@/fsd/app/hooks/useStore";
import {useCartStore} from "@/fsd/app/store/cart";
import React, {useEffect, useState} from "react";
import {useMutation} from "react-query";
import {GetCart, GetProductsByIds} from "@/fsd/shared/api/products";
import {IProductDetail} from "@/fsd/entities/product/model";
import Empty from "@/fsd/shared/ui/Empty/Empty";
import {Button} from "antd";
import Link from "next/link";
import {useCartTotal} from "@/fsd/app/hooks/useCartTotal";
import {ICartItem} from "@/fsd/entities/cartItem/model";
import {sendGTMEvent} from "@next/third-parties/google";

export default function CartItems() {
    const cart = useStore(useCartStore, (data) => data)
    const cartInfo = useCartTotal(cart?.items);
    return (
        <>
            {cart?.items?.length ?
                <>
                    <div className={s.wrapper}>
                        <div className={s.items}>
                            {cart.items.map(item => (
                                <CartItem item={item} product={cartInfo.products?.find(p => p.id === item.product_id)} key={`${item.product_id}${item.size_id}`}/>
                            ))}
                        </div>
                        <div className={s.total}>
                            <h3>Сумма заказа</h3>
                            <p>Без учета доставки</p>
                            <p className={s.price}>{cartInfo.total.toLocaleString()} ₽</p>
                        </div>
                    </div>
                    <Button type={'primary'} disabled={!!cart?.items.filter(el => !cartInfo.products?.find(c => c.id === el.product_id)).length} onClick={()=>{
                        sendGTMEvent({
                            event: 'begin_checkout',
                            ecommerce: {
                                items: cartInfo.products?.map(el => ({
                                    item_id: el.id,
                                    item_name: el.title,
                                    item_category: el.category?.name,
                                    item_section: el.category?.section.name,
                                    quantity: 1
                                })) ?? [],
                                total: cartInfo.total,
                                count: cartInfo.count
                            }
                        })
                    }}><Link href={'/checkout'}>Продолжить</Link></Button></> :
                <Empty title={'Вы еще ничего не добавили'}/>}
        </>
    )
}
