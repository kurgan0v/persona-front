import s from './OrderItem.module.scss';
import {IRequest} from "@/fsd/entities/request/model";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import {
    DELIVERY_STATUSES,
    DELIVERY_TYPES,
    ONLINE_PAYMENT_STATUSES,
    ORDER_STATUSES,
    PAYMENT_METHODS,
    REQUEST_TYPES
} from "@/fsd/app/const";
import dayjs from "dayjs";
import {clsx} from "clsx";
import {CaretRightOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {UploadFile} from "antd/es/upload/interface";
import {Modal} from "antd";
import EditIcon from "@/fsd/shared/ui/icons/EditIcon/EditIcon";
import {IOrder, IOrderItem} from "@/fsd/entities/order/model";
import Link from "next/link";
import {add} from "unload";
interface OrderItemProps{
    order: IOrder
    setEditModal: ()=>void
}

export default function OrderItem({order, setEditModal}: OrderItemProps){
    const status = [s.new, s.processing, s.processing, s.processing, s.processing, s.processing, s.processing, s.closed, s.cancelled];
    const [open, setOpen] = useState(false);
    const address: string[] = [];
    if(order.address){
        order.address.address && address.push(`${order.address.address}`)
        order.address.entrance && address.push(`подъезд ${order.address.entrance}`)
        order.address.apartment && address.push(`кв. ${order.address.apartment}`)
        order.address.floor && address.push(`этаж ${order.address.floor}`)
        order.address.code && address.push(`домофон ${order.address.code}`)
    }
    const subtotal = order.OrderItems.reduce((a, b)=>(a + b.quantity * (b.sale_price ?? b.price)), 0);
    return(
        <div className={s.wrapper}>
            <div className={s.header} >
                <div className={s.headerContent} onClick={()=>{setOpen(!open)}}>
                    <b className={s.info}>№{order.id}</b>
                    <div><p className={clsx(s.status, status[order.status])}>{ORDER_STATUSES[order.status]}</p></div>
                    <div>{dayjs(order.createdAt).format('DD.MM.YYYY HH:mm')}</div>
                    <CaretRightOutlined className={clsx(s.arrow, open && s.active)} />
                </div>
                <EditIcon onClick={setEditModal}/>
            </div>
            <div className={clsx(s.details, open && s.active)}>
                <div className={s.items}>
                    {order.OrderItems.map(el => (
                        <div className={s.item} key={el.id}>
                            <div className={s.info}>
                                <div className={s.image}>
                                    <CustomImage src={el.product?.gallery[0] ?? ''} alt={''} fill/>
                                </div>
                                <div className={s.textInfo}>
                                    <div className={s.itemHeader}>{el.product ? <Link href={`/admin/product/${el.product_id}`} key={el.id} target={'_blank'}>{el.title}</Link> : <h3>{el.title}</h3>}</div>
                                    <p>Размер: {el.size_name}</p>
                                </div>
                            </div>
                            <div className={s.prices}>
                                <div className={s.priceWrapper}>
                                    <p className={clsx(s.price, el.sale_price && s.oldPrice)}>{el.price} ₽</p>
                                    {el.sale_price && <p className={clsx(s.price, s.newPrice)}>{el.sale_price} ₽</p>}
                                </div>
                                <p>{el.quantity} шт</p>
                                <p className={clsx(s.price, s.subtotal)}>{(el.quantity * (el.sale_price ?? el.price)).toLocaleString()} ₽</p>
                            </div>
                        </div>
                    ))}
                    <div className={s.item}>
                        <div className={s.info}></div>
                        <div className={s.prices}>
                            <div className={s.totals}>
                                <div>
                                    <p>Сумма заказа:</p>
                                    <p>{subtotal.toLocaleString()} ₽</p>
                                </div>
                                {!!order.delivery_cost && <div>
                                    <p>Доставка:</p>
                                    <p>{order.delivery_cost.toLocaleString()} ₽</p>
                                </div>}
                                <div>
                                    <p>Итого:</p>
                                    <p>{(subtotal + (order.delivery_cost ?? 0)).toLocaleString()} ₽</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={s.orderDetails}>
                    <div className={s.orderDetail}>
                        <p className={clsx(s.statusDetail, s.statusDelivery)}><b>Статус доставки:</b> <span className={s.detailStatus}>{DELIVERY_STATUSES[order.delivery_status]}</span></p>
                        <p><b>Способ доставки:</b> {DELIVERY_TYPES[order.delivery_type]} </p>
                        {order.address && <>
                            <p><b>Тип доставки:</b> {order.address?.type === 137 ? 'Курьером' : 'ПВЗ'}</p>
                        </>}
                        {order.address?.type === 137 ? <>
                            <p><b>Регион:</b> {order.address.region_name}</p>
                            <p><b>Город:</b> {order.address.city_name}</p>
                            <p><b>Адрес:</b> {address.join(', ')}</p>
                        </>: <>
                            <p><b>ПВЗ:</b> {order.address?.pvz}</p>
                            <p><b>Адрес ПВЗ:</b> {order.address?.pvz_address}</p>
                        </>}
                    </div>
                    <div className={s.orderDetail}>
                        {(order.online_payment_status !== null && order.online_payment_status !== undefined) && <p className={s.statusDetail}><b>Статус оплаты:</b> <span className={s.detailStatus}>{ONLINE_PAYMENT_STATUSES[order.online_payment_status]}</span></p>}
                        <p><b>Способ оплаты:</b> {PAYMENT_METHODS[order.payment_method]}</p>
                        {order.requisites && <div>
                            <b>Реквизиты:</b>
                            {order.requisites.inn && <p>ИНН: {order.requisites.inn}</p>}
                            {order.requisites.kpp && <p>КПП: {order.requisites.kpp}</p>}
                            {order.requisites.bik && <p>БИК: {order.requisites.bik}</p>}
                            {order.requisites.checking_account && <p>Р./сч. {order.requisites.checking_account}</p>}
                            {order.requisites.correspondent_account && <p>Корр./сч. {order.requisites.correspondent_account}</p>}
                        </div>}
                    </div>
                </div>
                <div className={s.orderDetails}>
                    <div className={s.orderDetail}>
                        <p><b>ФИО: </b>{order.client_name}</p>
                        <p><b>Телефон: </b>{order.phone}</p>
                        <p><b>Email: </b>{order.email}</p>
                    </div>
                    {order.comment && <div className={s.orderDetail}>
                        <p><b>Информация о заказе: </b>{order.comment}</p>
                    </div>}
                </div>

                {/*{request.comment &&  <p><b>Комментарий пользователя: </b>{request.comment}</p>}
                {request.admin_comment &&  <p><b>Описание заявки: </b>{request.admin_comment}</p>}
                {!!request.attachments?.length && <div className={s.images}>
                    {request.attachments.map(el => (
                        <CustomImage className={s.img} onClick={()=>{
                            setPreviewImage(el);
                            setPreviewOpen(true);
                        }} folderPrefix={'requests'} key={el} src={el} alt={''} width={200} height={200}/>
                    ))}
                </div>}*/}
            </div>
        </div>
    )
}
