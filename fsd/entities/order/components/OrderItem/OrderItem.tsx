import s from './OrderItem.module.scss';
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
import React, {useMemo, useState} from "react";
import {App, Button, Form, Modal, Switch, Tooltip} from "antd";
import EditIcon from "@/fsd/shared/ui/icons/EditIcon/EditIcon";
import {IOrder} from "@/fsd/entities/order/model";
import Link from "next/link";
import {useMutation} from "react-query";
import {CheckInvoiceStatus, GetInvoiceDocument, OrderReserve, OrderUnreserve} from '@/fsd/shared/api/payment';

interface OrderItemProps {
    order: IOrder
    setEditModal: () => void
}

export default function OrderItem({order, setEditModal}: OrderItemProps) {
    const {mutateAsync: checkInvoiceStatus, data: dataOrder, isLoading} = useMutation(CheckInvoiceStatus);
    const {mutateAsync: getInvoiceDocument} = useMutation(GetInvoiceDocument);
    const {mutateAsync: reserveItems} = useMutation(OrderReserve);
    const {mutateAsync: unreserveItems} = useMutation(OrderUnreserve);
    const statuses = useMemo(()=>{
        const orderInfo = dataOrder ? dataOrder : order;
        return <div className={s.statuses}>
            <div className={clsx(orderInfo.status === 0 && s.active, orderInfo.status > 0 && s.completed)}>
                <h5>В обработке</h5>
            </div>
            {orderInfo.payment_method < 2 && <div className={clsx(orderInfo.status === 1 && s.active, orderInfo.status > 1 && s.completed)}>
                <h5>Оплата</h5>
                <p>
                    {ONLINE_PAYMENT_STATUSES[orderInfo.online_payment_status]}
                    {orderInfo.payment_approved && orderInfo.online_payment_status === 1 && <Tooltip title={'Оплата подтверждена банком'}> ✅</Tooltip>}
                </p>
                {orderInfo.invoice_id && <Button loading={isLoading} className={s.checkPayment} onClick={()=>{
                    if(order.invoice_id){
                        checkInvoiceStatus(order.invoice_id)
                    }
                }}>Проверить оплату</Button>}
            </div>}
            <div className={clsx(orderInfo.status === 2 && s.active, orderInfo.status > 2 && s.completed)}>
                <h5>Доставка</h5>
                <p>{DELIVERY_STATUSES[orderInfo.delivery_status]}</p>
            </div>
            <div className={clsx(orderInfo.status === 5 && s.active, orderInfo.status >= 3 && s.completed)}>
                <h5>{orderInfo.status > 3 ? ORDER_STATUSES[orderInfo.status] : 'Выполнен'}</h5>
            </div>
        </div>
    }, [dataOrder])
    const {message} = App.useApp();
    const status = [s.processing, s.processing, s.processing, s.closed, s.cancelled, s.processing];
    const [open, setOpen] = useState(false);
    const [reserved, setReserved] = useState(!!order.OrderItems[0].reserved_to)
    const address: string[] = [];
    if (order.address) {
        order.address.address && address.push(`${order.address.address}`)
        order.address.entrance && address.push(`подъезд ${order.address.entrance}`)
        order.address.apartment && address.push(`кв. ${order.address.apartment}`)
        order.address.floor && address.push(`этаж ${order.address.floor}`)
        order.address.code && address.push(`домофон ${order.address.code}`)
    }
    const subtotal = order.OrderItems.reduce((a, b) => (a + b.quantity * (b.sale_price ?? b.price)), 0);
    return (
        <div className={s.wrapper}>
            <div className={s.header}>
                <div className={s.headerContent} onClick={() => {
                    setOpen(!open)
                }}>
                    <b className={s.info}>№{order.id}</b>
                    <div><p className={clsx(s.status, status[order.status])}>{ORDER_STATUSES[order.status]}</p></div>
                    <div>{dayjs(order.createdAt).format('DD.MM.YYYY HH:mm')}</div>
                    <CaretRightOutlined className={clsx(s.arrow, open && s.active)}/>
                </div>
                <EditIcon onClick={setEditModal}/>
            </div>

            <div className={clsx(s.details, open && s.active)}>
                <div className={s.items}>
                    <div className={s.reserve}>
                        <Switch checked={reserved} onChange={async ()=>{
                            if(reserved){
                                await unreserveItems(order.id)
                            } else {
                                await reserveItems(order.id)
                            }
                            setReserved(!reserved)
                        }}/>
                        <p>Резерв на позиции</p>
                    </div>
                    {statuses}
                    {order.payment_method === 0 && order.status === 1 && <div className={s.paymentLink}>
                        <p>Ссылка для оплаты:</p>
                        <a onClick={(e) => {
                            navigator.clipboard.writeText(order.payment_link ?? '').then(r => message.success('Ссылка скопирована в буфер обмена'))
                        }}>{order.payment_link}</a>
                    </div>}
                    {order.OrderItems.map(el => (
                        <div className={s.item} key={el.id}>
                            <div className={s.info}>
                                <div className={s.image}>
                                    <CustomImage src={el.product?.gallery ? el.product?.gallery[0] : ''} alt={''} fill/>
                                </div>
                                <div className={s.textInfo}>
                                    <div className={s.itemHeader}>{el.product ?
                                        <Link href={`/admin/product/${el.product_id}`} key={el.id}
                                              target={'_blank'}>{el.title}</Link> : <h3>{el.title}</h3>}</div>
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
                        {/*<p className={clsx(s.statusDetail, s.statusDelivery)}><b>Статус доставки:</b> <span
                            className={s.detailStatus}>{DELIVERY_STATUSES[order.delivery_status]}</span></p>*/}
                        <p><b>Способ доставки:</b> {DELIVERY_TYPES[order.delivery_type]}</p>
                        {order.address && <>
                            <p><b>Тип доставки:</b> {order.address?.type === 137 ? 'Курьером' : 'ПВЗ'}</p>
                            {order.address?.type === 137 ? <>
                                <p><b>Регион:</b> {order.address.region_name}</p>
                                <p><b>Город:</b> {order.address.city_name}</p>
                                <p><b>Адрес:</b> {address.join(', ')}</p>
                            </> : <>
                                <p><b>ПВЗ:</b> {order.address?.pvz}</p>
                                <p><b>Адрес ПВЗ:</b> {order.address?.pvz_address}</p>
                            </>}</>}
                    </div>
                    <div className={s.orderDetail}>
                        {/*{(order.online_payment_status !== null && order.online_payment_status !== undefined) &&
                            <p className={s.statusDetail}><b>Статус оплаты:</b> <span
                                className={s.detailStatus}>{ONLINE_PAYMENT_STATUSES[order.online_payment_status]}</span>
                            </p>}*/}
                        <p><b>Способ оплаты:</b> {PAYMENT_METHODS[order.payment_method]}</p>
                        {order.requisites && <div>
                            <b>Реквизиты:</b>
                            {order.requisites.type && <p>{order.requisites.type === 'ip' ? 'Физ.лицо' : 'Юр.лицо'}</p>}
                            {order.requisites.name && <p>Плательщик: {order.requisites.name}</p>}
                            {order.requisites.inn && <p>ИНН: {order.requisites.inn}</p>}
                            {order.requisites.kpp && <p>КПП: {order.requisites.kpp}</p>}
                            {order.requisites.bik && <p>БИК: {order.requisites.bik}</p>}
                            {order.requisites.checking_account && <p>Р./сч. {order.requisites.checking_account}</p>}
                            {order.requisites.correspondent_account &&
                                <p>Корр./сч. {order.requisites.correspondent_account}</p>}
                            <a className={s.checkPayment} onClick={()=>{
                                if(order.invoice_id){
                                    getInvoiceDocument(order.invoice_id).then(r => {
                                        const blobURL = URL.createObjectURL(r);
                                        window.open(blobURL, '_blank');
                                    })
                                }
                            }}>Скачать счет</a>
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
