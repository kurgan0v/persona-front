import s from './Checkout.module.scss';
import CheckoutWidget from "@/fsd/widgets/User/CheckoutWidget/CheckoutWidget";
export default function Checkout(){
    return (
        <div className={s.wrapper}>
            <h2>Оформление заказа</h2>
            {/*<p>Оформление заказа временно недоступно</p>*/}
            <CheckoutWidget/>
        </div>
    )
}
