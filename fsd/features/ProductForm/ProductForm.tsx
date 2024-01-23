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
                    {product.category?.sizes?.map(size=>(
                        <div onClick={()=>setCurrentSize(size.id)} key={size.id} className={clsx(s.size, currentSize === size.id && s.choiced, !product.sizes.find(s => s.id === size.id) && s.disabled)}>{size.name}</div>
                    ))}
                </div>
                {product.category?.show_size_chart && <p className={s.table} onClick={()=>setOpenSizeTable(true)}>Таблица размеров</p>}
            </div>
            <div className={s.actions}>
                <div className={s.priceWrapper}>
                    <p className={clsx(s.price, product.sale && s.oldPrice)}>{product.basic_price} ₽</p>
                    {product.sale && <p className={clsx(s.price, s.newPrice)}>{product.sale_type === "percents" ? product.basic_price * (100 - product.sale)/100 : product.basic_price - product.sale} ₽</p>}
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
                    <p>Нет в наличии нужного размера или количества?</p>
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
                                <Image src={'/wb.png'} alt={'wb'} width={40} height={40}/>
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
                        product: product.id
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
                    <Form.Item name={'product'} hidden>
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
