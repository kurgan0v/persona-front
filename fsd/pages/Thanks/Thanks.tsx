"use client";
import s from './Thanks.module.scss';
import {Button} from "antd";
import Link from "next/link";
import {useCartStore} from "@/fsd/app/store/cart";
import {useStore} from "@/fsd/app/hooks/useStore";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
export default function Thanks(){
    const cartStore = useStore(useCartStore, (state => state))
    const { push } = useRouter();
    useEffect(() => {
        if(cartStore && !cartStore.order_number){
            push('/cart')
        }
    }, [cartStore]);
    return(
        <div className={s.wrapper}>
            <h2>Спасибо за покупку!</h2>
            <h3>Ваш номер заказа — {cartStore?.order_number}</h3>
            <p>Мы свяжемся с вами в ближайшее время для уточнения деталей</p>
            <Link href={'/'}><Button type={'primary'}>На главную</Button></Link>
        </div>
    )
}
