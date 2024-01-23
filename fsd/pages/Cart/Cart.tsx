import s from "./Cart.module.scss";
import Link from "next/link";
import {Button} from "antd";
import CartItems from "@/fsd/widgets/User/Cart/CartItems";

export default function Cart(){
    return(
        <div className={s.wrapper}>
            <h2>Корзина</h2>
            <CartItems/>
        </div>
    )
}
