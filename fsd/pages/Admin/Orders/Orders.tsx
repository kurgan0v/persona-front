import s from './Orders.module.scss';
import OrdersList from "@/fsd/widgets/Admin/OrdersList/OrdersList";
export default function Orders() {
    return (
        <div className={s.wrapper}>
            <h2>Заказы</h2>
            <OrdersList/>
        </div>
    )
}
