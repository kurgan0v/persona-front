"use client";
import s from './CheckoutWidget.module.scss';
import {App, Button, Col, Drawer, Flex, Form, Input, InputNumber, Modal, Radio, Row, Select, Space} from "antd";
import {DELIVERY_TYPES, PAYMENT_METHODS} from "@/fsd/app/const";
import React, {useEffect, useRef, useState} from "react";
import {useCartTotal} from "@/fsd/app/hooks/useCartTotal";
import {useStore} from "@/fsd/app/hooks/useStore";
import {useCartStore} from "@/fsd/app/store/cart";
import {MaskedInput} from "antd-mask-input";
import {IOrderNew} from "@/fsd/shared/api/order/types";
import {useMutation, useQuery} from "react-query";
import {CreateOrderFetcher} from "@/fsd/shared/api/order";
import {useRouter} from "next/navigation";
import {Placemark, YMaps, Map} from "@pbe/react-yandex-maps";
import {GetCities, GetDeliveryCost, GetDeliveryPoints, GetRegions} from "@/fsd/shared/api/cdek";
import {clsx} from "clsx";
import {City} from "@/fsd/shared/api/cdek/types";
import Link from "next/link";
import {sendGTMEvent} from "@next/third-parties/google";
interface CdekDelivery{
    tariff_code: number
    code: string
    address: string
}
export default function CheckoutWidget() {
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const refListPoints = useRef<HTMLDivElement>(null);
    const {push} = useRouter();
    const [cdekDeliveryType, setCdekDeliveryType] = useState(0);
    const [deliveryType, setDeliveryType] = useState(0);
    const [pointsModal, setPointsModal] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState(0);
    const [deliveryPointAddress, setDeliveryPointAddress] = useState<string|undefined>();
    const [deliveryCost, setDeliveryCost] = useState(0);
    const cart = useStore(useCartStore, (data) => data)
    const cartInfo = useCartTotal(cart?.items);
    const [selectedPoint, setSelectedPoint] = useState('');
    const [region, setRegion] = useState<string | undefined>();
    const [pointsListVisible, setPointsListVisible] = useState(false);
    const [city, setCity] = useState<City | undefined>();
    useEffect(() => {
        if(cart && cartInfo.products){
            if(cart?.items.filter(el => !cartInfo.products?.find(c => c.id === el.product_id)).length){
                push('/cart')
            }
        }
    }, [cart, cartInfo]);
    const {data: regions, isSuccess: isSuccessRegions} = useQuery(['regions'], GetRegions);
    const {
        mutateAsync: getDeliveryPoints,
        data: deliveryPoints,
        isSuccess: isSuccessDeliveryPoints
    } = useMutation(['delivery_points', city?.code], GetDeliveryPoints);
    const {
        mutateAsync: getCities,
        data: cities,
        isSuccess: isSuccessCities,
        isLoading: isLoadingCities
    } = useMutation(['cities', region], GetCities);
    const {
        mutateAsync: getDeliveryCost,
        data: costs,
        isSuccess: isSuccessCost,
        isLoading: isLoadingCost
    } = useMutation(['delivery_cost', city], GetDeliveryCost);
    const {mutateAsync: createOrder, isLoading, isSuccess} = useMutation(CreateOrderFetcher);

    function num_word(value: number) {
        value = Math.abs(value) % 100;
        let num = value % 10;
        if (value > 10 && value < 20) return 'товаров';
        if (num > 1 && num < 5) return 'товара';
        if (num == 1) return 'товар';
        return 'товаров';
    }

    useEffect(() => {
        if (cart && !cart.items.length) {
            if (!cart.order_number) {
                push('/cart')
            } else {
                push('/thanks')
            }
        }
    }, [cart]);
    useEffect(() => {
        setPaymentMethod(0)
        form.setFieldValue('payment_method', 0)
    }, [deliveryType]);
    useEffect(() => {
        if (region) {
            setCity(undefined)
            getCities(region)
        }
    }, [region]);
    useEffect(() => {
        if (city) {
            getDeliveryCost(city.code)
            setSelectedPoint('')
            refListPoints.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [city]);
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    return (
        <>
            <Form
                form={form}
                layout={'vertical'}
                initialValues={{
                    delivery_type: 0,
                    payment_method: 0
                }}
                onFinish={(e: IOrderNew) => {
                    if (cart?.items) {
                        createOrder({order: e, items: cart.items}).then(r => {
                            if(r.paymentInfo) {
                                window.open(r.paymentInfo.paymentLink)
                            }
                            sendGTMEvent({
                                event: 'purchase',
                                ecommerce: {
                                    order_number: r.id,
                                    total: r.total,
                                    shipping: r.delivery_cost,
                                    items: r.OrderItems.map(el => ({
                                        item_id: el.product_id,
                                        item_name: el.title,
                                        item_size: el.size,
                                        price: el.sale_price ? el.sale_price : el.price,
                                        quantity: el.quantity,
                                    }))
                                }
                            })
                            message.success('Ваш заказ принят')
                            cart.setOrderNumber(r.id);
                            cart.clearCart();
                        }).catch(async (e) => {
                            await message.error(e.response.data)
                        });
                    }
                }}
            >
                <div className={s.row}>
                    <div className={s.column}>
                        <h3>Доставка</h3>
                        <Form.Item name={'delivery_type'}>
                            <Radio.Group onChange={(e) => setDeliveryType(e.target.value)}>
                                <Space direction="vertical">
                                    {DELIVERY_TYPES.map((m, i) => <Radio value={i} key={m}>{m}</Radio>)}
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                        {deliveryType === 0 && <p>
                            <b>Самовывоз доступен по адресу:</b><br/>
                            г. Саратов, ул. Чернышевского, д. 88<br/>
                            Фирменный магазин «Персона»
                        </p>}
                        {deliveryType === 1 && <>
                            <Form.Item name={['address', 'region_name']} hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name={['address', 'city_name']} hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item label={'Регион'} name={['address', 'region']} >
                                <Select
                                    value={region}
                                    className={s.select}
                                    filterOption={filterOption}
                                    showSearch
                                    placeholder={'Московская область'}
                                    loading={isLoadingCities}
                                    aria-autocomplete={'none'}
                                    options={
                                        regions?.map(el => (
                                            {
                                                label: el.region,
                                                value: `${el.region_code}`
                                            }
                                        ))
                                    }
                                    onChange={(e, v) => {
                                        setRegion(e)
                                        //@ts-ignore
                                        form.setFieldValue(['address', 'region_name'], v.label)
                                    }}
                                />
                            </Form.Item>
                            {isSuccessCities && <Form.Item label={'Город'} name={['address', 'city']}>
                                <Select value={city?.code ? `${city?.code}` : null} aria-autocomplete={'none'} onChange={(e, v) => {
                                    const currentCity = cities?.find(c => `${c.code}` === e);
                                    setCity(currentCity)
                                    form.setFieldValue(['address', 'city_name'], currentCity?.city)
                                }} className={s.select} filterOption={filterOption} showSearch
                                        placeholder={'Егорьевск'} options={
                                    cities?.map(el => (
                                        {
                                            value: `${el.code}`,
                                            label: el.city
                                        }
                                    ))
                                }/>
                            </Form.Item>}
                            {isSuccessCities && isSuccessCost && <Form.Item name={['address', 'type']} label={'Тип доставки'}>
                                <Radio.Group onChange={(e)=>setCdekDeliveryType(e.target.value)}  style={{width: '100%'}} className={s.wrapperDeliveryTypes}>
                                    <Row gutter={20} className={s.deliveryMethods}>
                                        {costs?.map((m) =>
                                            <Radio value={m.tariff_code} key={m.tariff_code} onClick={()=>{
                                                if(m.tariff_code === 137){

                                                } else {
                                                    if(city?.code){
                                                        getDeliveryPoints(city.code)
                                                    }
                                                    setPointsModal(true)
                                                }
                                            }}>
                                                <div className={s.deliveryOption} onClick={(e)=>{setDeliveryCost(m.delivery_sum)}}>
                                                    <h5>{m.tariff_code === 137 ? 'Курьером' : 'В пункт выдачи'}</h5>
                                                    <p>от {m.period_min} до {m.period_max} дней</p>
                                                    <p>{m.delivery_sum} ₽</p>
                                                </div>
                                            </Radio>
                                        )}
                                    </Row>
                                </Radio.Group>
                            </Form.Item>}
                        </>}
                         {deliveryType === 1 && cdekDeliveryType === 137 && <>
                            <div>
                                <Form.Item label={'Адрес'} name={['address', 'address']} rules={[
                                    {
                                        required: true,
                                        message: 'Это обязательное поле'
                                    },
                                ]}>
                                    <Input placeholder={'ул. Московская, д. 12'}/>
                                </Form.Item>
                                <Row gutter={20}>
                                    <Col span={12}>
                                        <Form.Item label={'Подъезд'} name={['address', 'entrance']}>
                                            <Input placeholder={'2'}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={'Квартира'} name={['address', 'apartment']}>
                                            <Input placeholder={'35'}/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={20}>
                                    <Col span={12}>
                                        <Form.Item label={'Этаж'} name={['address', 'floor']}>
                                            <Input placeholder={'3'}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={'Домофон'} name={['address', 'code']}>
                                            <Input placeholder={'35'}/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        </>}
                        {deliveryType === 1 && cdekDeliveryType === 368 && <div className={s.chosenPvz}>
                            <Form.Item name={['address', 'pvz']} hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name={['address', 'pvz_address']} hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name={['address', 'pvz_note']} hidden>
                                <Input />
                            </Form.Item>
                            <Button onClick={()=>setPointsModal(true)}>Открыть карту</Button>
                            <p><b>Пункт выдачи заказов:</b> <br/>{deliveryPointAddress ?? 'Не выбран'}</p>
                        </div>}
                    </div>
                    <div className={s.column} >
                        <h3>Оплата</h3>
                        <Form.Item name={'payment_method'}>
                            <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)}>
                                <Space direction="vertical">
                                    {deliveryType === 0
                                        ?
                                        PAYMENT_METHODS.map((m, i) => <Radio value={i} key={m}>{m}</Radio>)
                                        :
                                        PAYMENT_METHODS.slice(0,2).map((m, i) => <Radio value={i} key={m}>{m}</Radio>)
                                    }
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                        {paymentMethod === 2 && <p>
                            При получении заказа вы сможете оплатить его с помощью банковской карты, СБП или наличными
                        </p>}
                        {paymentMethod === 0 && <p>
                            После оформления заказа вы будете перенаправлены на страницу оплаты
                        </p>}

                        {paymentMethod === 1 && <>
                            <p className={s.info}>
                                После оформления заказа на почту, указанную в заказе, придет счет для оплаты
                            </p>
                            <Form.Item label={'Тип организации'} name={['requisites', 'type']} rules={[
                                {
                                    required: true,
                                    message: 'Это обязательное поле'
                                }
                            ]}>
                                <Radio.Group>
                                    <Radio value={'ip'}>ИП</Radio>
                                    <Radio value={'company'}>Юр. лицо</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label={'Наименование покупателя или заказчика'} name={['requisites', 'name']} rules={[
                                {
                                    required: true,
                                    message: 'Это обязательное поле'
                                }
                            ]}>
                                <Input placeholder={"Название организации или ФИО"}/>
                            </Form.Item>
                            <Form.Item label={'ИНН'} name={['requisites', 'inn']} rules={[
                                () => ({
                                    validator(_, value) {
                                        if (value.length === 10 || value.length === 12) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Некорректный ИНН'));
                                    },
                                })]}>
                                <MaskedInput mask={'0000000000[00]'} maskOptions={{
                                    lazy: true
                                }} placeholder={'10 или 12 цифр, без пробелов'}/>
                            </Form.Item>
                            <Row gutter={20}>
                                <Col span={12}>
                                    <Form.Item label={'БИК'} name={['requisites', 'bik']} rules={[() => ({
                                        validator(_, value) {
                                            if (value.length === 9) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Некорректный БИК'));
                                        },
                                    })]}>
                                        <MaskedInput maxLength={9} showCount mask={'000000000'} maskOptions={{
                                            lazy: true
                                        }} placeholder={'9 цифр, без пробелов'}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={'КПП'} name={['requisites', 'kpp']} rules={[() => ({
                                        validator(_, value) {
                                            if (value.length === 9) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Некорректный КПП'));
                                        },
                                    })]}>
                                        <MaskedInput maxLength={9} showCount mask={'000000000'} maskOptions={{
                                            lazy: true
                                        }} placeholder={'9 цифр, без пробелов'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label={'Расчетный счет'} name={['requisites', 'checking_account']} rules={[() => ({
                                validator(_, value) {
                                    if (value.length === 20) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Некорректное значение'));
                                },
                            })]}>
                                <MaskedInput maxLength={20} showCount mask={'00000000000000000000'} maskOptions={{
                                    lazy: true
                                }} placeholder={'20 цифр, без пробелов'}/>
                            </Form.Item>
                            <Form.Item label={'Корреспондентский счет'} name={['requisites', 'correspondent_account']}
                                       rules={[() => ({
                                           validator(_, value) {
                                               if (value.length === 20) {
                                                   return Promise.resolve();
                                               }
                                               return Promise.reject(new Error('Некорректное значение'));
                                           },
                                       })]}>
                                <MaskedInput maxLength={20} showCount mask={'00000000000000000000'} maskOptions={{
                                    lazy: true
                                }} placeholder={'20 цифр, без пробелов'}/>
                            </Form.Item>
                        </>}
                    </div>
                    <div className={s.column} >
                        <div className={s.orderInfos}>
                            <h3>Итого</h3>
                            <div className={s.orderInfo}>
                                <p>{cartInfo.count} {num_word(cartInfo.count)}</p>
                                <p>{cartInfo.total.toLocaleString()} ₽</p>
                            </div>
                            <div className={s.orderInfo}>
                                <p>Доставка</p>
                                <p>{deliveryCost.toLocaleString()} ₽</p>
                            </div>
                            <div className={s.orderInfo}>
                                <h3>К оплате</h3>
                                <h3>{(cartInfo.total + deliveryCost).toLocaleString()} ₽</h3>
                            </div>
                        </div>
                        <Form.Item name={'client_name'} label={'ФИО получателя'} rules={[
                            {
                                required: true,
                                message: 'Это обязательное поле'
                            },
                        ]}>
                            <Input placeholder={'Иванов Иван Иванович'}/>
                        </Form.Item>
                        <Form.Item name={'phone'} label={'Номер телефона'} rules={[
                            {
                                required: true,
                                message: 'Это обязательное поле'
                            },
                            {
                                len: 16,
                                message: 'Некорректный номер'
                            }
                        ]}>
                            <MaskedInput mask={'+{7}(000)000-00-00'} maskOptions={{lazy: true}}
                                         placeholder={'+7(000)000-00-00'}/>
                        </Form.Item>
                        <Form.Item name={'email'} label={'Email'} rules={[
                            {
                                required: true,
                                message: 'Это обязательное поле'
                            },
                            {
                                type: 'email',
                                message: 'Некорректный email'
                            }
                        ]}>
                            <Input placeholder={'example@mail.ru'}/>
                        </Form.Item>
                        <Form.Item>
                            <div>
                                <Button disabled={cdekDeliveryType === 368 ? !deliveryPointAddress : false} className={s.create} type={'primary'} htmlType={'submit'} loading={isLoading}>Оформить
                                    заказ</Button>
                                <p className={s.agreement}>Нажимая кнопку «Оформить заказ», вы даете <Link target="_blank" href="/agreement.pdf">согласие на обработку персональных данных</Link>, соглашаетесь с <Link target="_blank"  href={'/Оферта.pdf'}>договором-офертой</Link> и <Link target={'_blank'} href={'/privacy-policy.pdf'}>политикой конфиденциальности</Link></p>
                            </div>
                        </Form.Item>
                    </div>
                </div>
            </Form>
            <Modal
                open={pointsModal}
                onCancel={() => setPointsModal(false)}
                width={800}
                footer={null}
            >
                <div className={s.wrapperModalPoints}>
                    <div className={clsx(s.wrapperPoints, pointsListVisible && s.visible)}>
                        <svg className={s.pointsListSwitcher} onClick={() => setPointsListVisible(!pointsListVisible)}
                             xmlns="http://www.w3.org/2000/svg" width="192" height="352" viewBox="0 0 192 352"
                             fill="none">
                            <path
                                d="M192 176C192.002 178.101 191.589 180.182 190.785 182.124C189.98 184.065 188.8 185.828 187.312 187.312L27.312 347.312C21.06 353.564 10.936 353.564 4.68802 347.312C-1.55998 341.06 -1.56398 330.936 4.68802 324.688L153.376 176L4.68801 27.312C-1.56399 21.06 -1.56399 10.936 4.68801 4.68796C10.94 -1.56004 21.064 -1.56404 27.312 4.68796L187.312 164.688C188.8 166.172 189.98 167.935 190.785 169.876C191.589 171.818 192.002 173.899 192 176Z"
                                fill="currentColor"/>
                        </svg>
                        <div className={s.pointsList} ref={refListPoints}>

                            {deliveryPoints?.map(el => {
                                return (
                                    <div onClick={() => setSelectedPoint(el.code)}
                                         className={clsx(s.point, selectedPoint === el.code && s.active)} key={el.code}>
                                        <div className={s.pointInfo}>
                                            <h5>{el.name}</h5>
                                            <p>{el.location.address}</p>
                                            {selectedPoint === el.code && <>
                                                <p>{el.address_comment}</p>
                                                <Button type={'default'} className={s.btn} onClick={()=>{
                                                    setPointsModal(false)
                                                    setDeliveryPointAddress(el.location.address_full)
                                                    form.setFieldValue(['address', 'pvz'], el.code)
                                                    form.setFieldValue(['address', 'pvz_address'], el.location.address_full)
                                                    form.setFieldValue(['address', 'pvz_note'], el.note)
                                                }}>{deliveryPointAddress === el.location.address_full ? 'Выбрано' : 'Доставить сюда'}</Button>
                                            </>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                    <YMaps>
                        <Map width={720} height={560} state={{
                            center: [city?.latitude ?? 0, city?.longitude ?? 0],
                            zoom: 12,
                        }}>
                            {deliveryPoints?.map(el => {
                                return (
                                    <Placemark
                                        key={el.code}
                                        onClick={() => {
                                            setPointsListVisible(true)
                                            setSelectedPoint(el.code)
                                            setTimeout(() => {
                                                const activePoint = refListPoints.current?.querySelector(`.${s.active}`);
                                                activePoint?.scrollIntoView({block: "center", behavior: "smooth"})
                                            }, 0)
                                        }}
                                        options={{
                                            iconColor: selectedPoint === el.code ? '#ff735c' : '#00AD3A',
                                            preset: 'islands#dotIcon',
                                        }}
                                        geometry={[el.location.latitude, el.location.longitude]}
                                    />
                                )
                            })}
                        </Map>
                    </YMaps>
                </div>

            </Modal>
        </>
    )
}
