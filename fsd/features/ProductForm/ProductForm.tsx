"use client";
import {IProduct, IProductDetail} from "@/fsd/entities/product/model";
import s from "./ProductForm.module.scss";
import {App, Button, Divider, Form, Input, Modal, Upload} from "antd";
import ButtonRound from "@/fsd/shared/ui/ButtonRound/ButtonRound";
import Image from "next/image";
import Favorite from "@/fsd/shared/ui/icons/Favorite/Favorite";
import {clsx} from "clsx";
import React, {useState} from "react";
import {useFavoritesStore} from "@/fsd/app/store/favorites";
import {useCartStore} from "@/fsd/app/store/cart";
import Minus from "@/fsd/shared/ui/icons/Minus/Minus";
import Plus from "@/fsd/shared/ui/icons/Plus/Plus";
import {useStore} from "@/fsd/app/hooks/useStore";
import {useMutation} from "react-query";
import {RequestCreateFetcher} from "@/fsd/shared/api/request";
import {MaskedInput} from "antd-mask-input";
import {UploadOutlined} from "@ant-design/icons";

export default function ProductForm({product}: {product: IProductDetail}){
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [showAllSizes, setShowAllSizes] = useState(product.category?.sizes?.length ? product.category?.sizes?.length < 10 : true)
    const [openRequest, setOpenRequest] = useState(false);
    const {mutateAsync: sendRequest} = useMutation(RequestCreateFetcher);
    const favoritesStore = useFavoritesStore()
    const cartStore = useStore(useCartStore, (state => state))
    const [currentSize, setCurrentSize] = useState<string | undefined>();
    const [openSizeTable, setOpenSizeTable] = useState(false);
    const addToCart = ()=>{
        if(currentSize){
            cartStore?.addItem({product_id: product.id, size_id: currentSize, quantity: 1})
        }
    }
    const plus = ()=>{
        if(currentSize){
            cartStore?.increaseValue({product_id: product.id, size_id: currentSize})
        }
    }
    const minus = ()=>{
        if(currentSize){
            cartStore?.decreaseValue({product_id: product.id, size_id: currentSize})
        }
    }
    return(
        <>
            <div className={s.sizesWrapper}>
                <p>Размеры:</p>
                <div className={s.sizes}>
                    {showAllSizes ? product.category?.sizes?.map(size=>(
                        <div onClick={()=>setCurrentSize(size.id)} key={size.id} className={clsx(s.size, currentSize === size.id && s.choiced, !product.sizes.find(s => s.id === size.id) && s.disabled)}>{size.name}</div>
                    )) : product.category?.sizes?.slice(0,10).map(size=>(
                        <div onClick={()=>setCurrentSize(size.id)} key={size.id} className={clsx(s.size, currentSize === size.id && s.choiced, !product.sizes.find(s => s.id === size.id) && s.disabled)}>{size.name}</div>
                    ))}
                    {!showAllSizes && <p onClick={()=>setShowAllSizes(true)} className={clsx(s.size)}>Показать все размеры</p>}
                </div>
                {product.category?.show_size_chart && <p className={s.table} onClick={()=>setOpenSizeTable(true)}>Таблица размеров</p>}
            </div>
            <div className={s.actions}>
                <div className={s.priceWrapper}>
                    <p className={clsx(s.price, product.sale && s.oldPrice)}>{product.basic_price.toLocaleString()} ₽</p>
                    {product.sale && <p className={clsx(s.price, s.newPrice)}>{product.sale_type === "percents" ? (product.basic_price * (100 - product.sale)/100).toLocaleString() : (product.basic_price - product.sale).toLocaleString()} ₽</p>}
                </div>
                <div className={s.actionsMain}>
                    {cartStore?.items.find(el => el.product_id === product.id && el.size_id === currentSize)?.quantity ? <div className={s.quantity}>
                        <Button className={s.quantityAction} onClick={minus}>
                            <Minus/>
                        </Button>
                        <p>{cartStore?.items.find(el => el.product_id === product.id && el.size_id === currentSize)?.quantity ?? 0}</p>
                        <Button className={clsx(s.quantityAction, ((product.sizes.find((el) => el.id === currentSize)?.ProductSize?.quantity ?? 0) <= (cartStore?.items.find(el => el.product_id === product.id && el.size_id === currentSize)?.quantity ?? 1)) && s.disabledAction)} onClick={plus}>
                            <Plus/>
                        </Button>
                    </div> : <Button type={'primary'} disabled={!product.sizes.length || !currentSize} onClick={addToCart}>Добавить в корзину</Button>}
                    <ButtonRound onClick={()=>favoritesStore.setFavorites(product.id)} className={clsx(favoritesStore.favorites.includes(product.id) && s.activeFavorite)}>
                        <Favorite />
                    </ButtonRound>
                </div>
                <div className={s.subscribe}>
                    <p>Не нашли нужный размер или количество?</p>
                    <p><Button type={'link'} onClick={()=>setOpenRequest(true)}>Оставьте заявку</Button>, чтобы узнать о поступлении</p>
                </div>
                {(product.wildberries || product.detmir) && <>
                    <Divider>
                        <p className={s.divider}>или</p>
                    </Divider>
                    <div className={s.marketLinksWrapper}>
                        <p>
                            Купить на маркетплейсе:
                        </p>
                        <div className={s.marketLinks}>
                            {product.wildberries && <a target={'_blank'} className={s.marketLink} href={`https://www.wildberries.ru/catalog/${product.wildberries}/detail.aspx`}>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_24_2)">
                                        <path d="M0 10C0 4.47715 4.47715 0 10 0H30C35.5228 0 40 4.47715 40 10V30C40 35.5228 35.5228 40 30 40H10C4.47715 40 0 35.5228 0 30V10Z" fill="url(#paint0_linear_24_2)"/>
                                        <path d="M11.5417 27.0835H8.91317L5 13.3335H7.39137L10.2966 24.0782L13.439 13.3335H15.5339L18.6565 24.0782L21.5617 13.3335H23.9531L20.0399 27.0835H17.4114L14.4864 17.046L11.5417 27.0835ZM33.0632 19.9532C34.2687 20.5817 35 21.721 35 23.1549C35 24.2746 34.6047 25.2174 33.7944 25.9638C32.9842 26.7102 32.0157 27.0835 30.8497 27.0835H24.9207V13.3335H30.4149C31.5414 13.3335 32.5098 13.7067 33.2806 14.4335C34.0711 15.1602 34.4664 16.0638 34.4664 17.1442C34.4664 18.3424 33.9921 19.2657 33.0632 19.9532ZM30.4149 15.4549H27.1934V19.0692H30.4149C31.4228 19.0692 32.1936 18.2835 32.1936 17.2621C32.1936 16.2407 31.4228 15.4549 30.4149 15.4549ZM27.1934 24.9621H30.8497C31.8972 24.9621 32.7273 24.1174 32.7273 23.0371C32.7273 21.9567 31.8972 21.1121 30.8497 21.1121H27.1934V24.9621Z" fill="white"/>
                                    </g>
                                    <defs>
                                        <linearGradient id="paint0_linear_24_2" x1="-0.0842683" y1="2.40107" x2="43.696" y2="7.97759" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#ED3CCA"/>
                                            <stop offset="0.145833" stopColor="#DF34D2"/>
                                            <stop offset="0.291667" stopColor="#D02BD9"/>
                                            <stop offset="0.432292" stopColor="#BF22E1"/>
                                            <stop offset="0.572917" stopColor="#AE1AE8"/>
                                            <stop offset="0.713542" stopColor="#9A10F0"/>
                                            <stop offset="0.854167" stopColor="#8306F7"/>
                                            <stop offset="1" stopColor="#7C1AF8"/>
                                        </linearGradient>
                                        <clipPath id="clip0_24_2">
                                            <rect width="40" height="40" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </a>}
                            {product.detmir && <a className={s.marketLink} href={product.detmir}>
                                <Image src={'/detmir.png'} alt={'detmir'} width={40} height={40}/>
                            </a>}
                        </div>
                    </div></>}
            </div>
            <Modal
                open={openSizeTable}
                onCancel={()=>setOpenSizeTable(false)}
                footer={null}
                title={'Размерная сетка'}
            >
                <div className={s.sizeTable}>
                    {product.category?.sizes?.map((el)=>(
                        <div key={el.id} className={s.sizeTableRow}>
                            <p>{el.name}</p>
                            <p>{el.value ?? 'не указано'}</p>
                        </div>
                    ))}
                </div>
            </Modal>
            <Modal
                open={openRequest}
                onCancel={()=>setOpenRequest(false)}
                footer={null}
                title={'Уведомление о поступлении'}
            >
                <Form
                    form={form}
                    initialValues={{
                        type: 1,
                        product_id: product.id
                    }}
                    layout={'vertical'}
                    onFinish={async (e)=>{
                        const data = new FormData();
                        for(let key in e){
                            if(e[key]){
                                data.append(key, e[key]);
                            }
                        }
                        sendRequest(data).then(async ()=>{
                            setOpenRequest(false);
                            form.resetFields();
                            await message.success('Ваша заявка принята! Мы оповестим вас о поступлении')
                        }).catch(async ()=>{
                            await message.error('При отправке заявки произошла ошибка. Попробуйте позже или свяжитесь с нами другим способом')
                        })
                    }}
                >
                    <Form.Item name={'type'} hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'product_id'} hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'name'} label={'Ваше имя'} rules={[{
                        required: true,
                        message: 'Обязательно заполните это поле'
                    }]}>
                        <Input placeholder={'Иван'}/>
                    </Form.Item>
                    <Form.Item name={'phone'} label={'Ваш телефон'} rules={[{
                        required: true,
                        message: 'Это обязательное поле'
                    }, {
                        len: 16,
                        message: 'Некорректный номер'
                    }]}>
                        <MaskedInput mask={'+{7}(000)000-00-00'} maskOptions={{lazy: true}}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type={'primary'} htmlType={'submit'}>Отправить</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
