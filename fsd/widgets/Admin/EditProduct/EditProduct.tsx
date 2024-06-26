"use client";
import {
    App,
    Button,
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Select,
    Switch, Tooltip
} from "antd";
import {useMutation, useQuery} from "react-query";
import {
    GetProductFetcher, ProductCopyFetcher,
    ProductDeleteFetcher,
    ProductUpdateFetcher
} from "@/fsd/shared/api/products";
import {notFound, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import s from './EditProduct.module.scss';
import {CaretDownFilled, QuestionCircleOutlined, WarningFilled, WarningOutlined} from "@ant-design/icons";
import {SectionsAllFetcher} from "@/fsd/shared/api/section";
import {CategoriesFetcher} from "@/fsd/shared/api/category";
import {ICharacteristicType} from "@/fsd/entities/characteristics/model";
import {
    CharacteristicsByCategoryFetcher
} from "@/fsd/shared/api/characteristics";
import {SizesByCategoryFetcher} from "@/fsd/shared/api/size";
import {ISize} from "@/fsd/entities/size/model";
import {ICategory} from "@/fsd/entities/category/model";
import {PromosFetcher} from "@/fsd/shared/api/promo";
import {IProduct} from "@/fsd/entities/product/model";
import EditProductCharacteristics from "@/fsd/widgets/Admin/EditProductCharacteristics/EditProductCharacteristics";
import EditProductSizes from "@/fsd/widgets/Admin/EditProductSizes/EditProductSizes";
import EditProductGallery from "@/fsd/widgets/Admin/EditProductGallery/EditProductGallery";
import {clsx} from "clsx";

export default function EditProduct({id}: { id: string }) {
    const {push} = useRouter();
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const {
        data: dataPromos,
    } = useQuery(['promos_all'], PromosFetcher);
    const [sale, setSale] = useState<number | undefined>();
    const [sizes, setSizes] = useState<ISize[]>([]);
    const [characteristics, setCharacteristics] = useState<ICharacteristicType[] | undefined>();
    const [categories, setCategories] = useState<ICategory[] | undefined>();
    const {data: product, isSuccess, isError, refetch} = useQuery(['product', id], () => GetProductFetcher(id))
    useEffect(() => {
        if (isSuccess) {
            form.setFieldsValue(product)
            for (let characteristic of product?.characteristics) {
                form.setFieldValue(['characteristic', characteristic.type], characteristic.id)
            }
            form.setFieldValue('section_id', product?.category?.section.id)
            form.setFieldValue('promos', (product?.promos ? product?.promos : []))
            getCategories(product?.category?.section.id ?? '').then(setCategories)
            setSale(product?.sale_type)

            getCharacteristicsTypes(product?.category_id).then(setCharacteristics)
            getSizes(product?.category_id).then(setSizes)
            //getCategories(product?.section_id).then(setCategories)
        }
    }, [isSuccess]);
    const {
        data: sections,
        isSuccess: isSuccessSections
    } = useQuery(['sections_all'], SectionsAllFetcher);
    const {mutateAsync: updateProduct} = useMutation(ProductUpdateFetcher)
    const {mutateAsync: getCategories} = useMutation(CategoriesFetcher);
    const {mutateAsync: getCharacteristicsTypes} = useMutation(CharacteristicsByCategoryFetcher);
    const {mutateAsync: getSizes} = useMutation(SizesByCategoryFetcher);
    const {mutateAsync: deleteProduct} = useMutation(ProductDeleteFetcher);
    const {mutateAsync: copyProduct} = useMutation(ProductCopyFetcher);

    const {Option} = Select;
    if (isError) return notFound();

    async function createCopy() {
        if (product?.id) {
            const data: IProduct = await form.getFieldsValue()
            updateProduct({
                ...data,
                id: product.id
            }).then((r) => {
                message.success('Копия товара создана')
                copyProduct(product.id).then((r) => {
                    push(`/admin/product/${r.id}`)
                })
            })
        }
    }

    return (
        <>
            <h2>{product?.title}</h2>
            <Form
                form={form}
                layout={'vertical'}
                onFinish={(e) => {
                    updateProduct({
                        ...e,
                        id: product?.id
                    }).then(() => {
                        message.success('Товар обновлен')
                        //push('/admin/products')
                    })
                }}
            >
                <div className={s.columns}>
                    {isSuccessSections && <div>
                        <Form.Item className={s.select} label={'Раздел'} name={'section_id'} rules={[
                            {
                                required: true,
                                message: 'Это обязательное поле'
                            }
                        ]}>
                            <Select
                                suffixIcon={<CaretDownFilled/>} className={s.select} placeholder={'Выберите раздел'}

                                onChange={(e) => {

                                    setCategories(undefined)
                                    form.setFieldValue('category_id', '')
                                    getCategories(e).then(r => setCategories(r))
                                }}>
                                {
                                    sections.map(el => (
                                        <Option key={el.id} value={el.id}>{el.name}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </div>}
                    {categories && <div>
                        <Form.Item name={'category_id'} label={<div>Категория <Tooltip title={'Осторожно! После выбора новой категории и обновления товара будет утеряна информация о наличии и характеристиках товара'}>
                            <WarningOutlined/>
                        </Tooltip></div>} rules={[
                            {
                                required: true,
                                message: 'Это обязательное поле'
                            }
                        ]}>

                            <Select
                                suffixIcon={<CaretDownFilled/>} className={s.select} placeholder={'Выберите категорию'}
                                onChange={(e) => {
                                    getCharacteristicsTypes(e).then(setCharacteristics)
                                }}>
                                {categories.map(el => (
                                    <Option key={el.id} value={el.id}>{el.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>}
                </div>
                <div className={clsx(s.columns, s.options)}>
                    <div>
                        <Form.Item name={'visible'} label={'Отображать в каталоге'} valuePropName={'checked'}>
                            <Switch/>
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item name={'is_popular'} label={'Отображать в популярном'} valuePropName={'checked'}>
                            <Switch/>
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item name={'is_new'} label={'Отображать как новинку'} valuePropName={'checked'}>
                            <Switch/>
                        </Form.Item>
                    </div>
                </div>
                <EditProductGallery product={product} refetch={refetch} id={id}/>
                <Form.Item name={'promos'} label={'Промо-акции'}>
                    <Select
                        suffixIcon={<CaretDownFilled/>} className={s.select} placeholder={'Выберите промо-акции'}
                        mode={"multiple"}
                    >
                        {dataPromos?.filter(el => el.link).map(el => (
                            <Option key={el.id} value={el.link}>{el.title}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name={'title'} label={'Название товара'} rules={[
                    {
                        required: true,
                        message: 'Это обязательное поле'
                    }
                ]}>
                    <Input placeholder={'Рубашка белая'} showCount/>
                </Form.Item>
                <Form.Item name={'vendor_code'} label={'Артикул склада'}>
                    <Input.TextArea placeholder={'арт0001'} showCount maxLength={255} rows={1}/>
                </Form.Item>
                <Form.Item name={'description'} label={'Описание товара'}>
                    <Input.TextArea
                        placeholder={'Рубашка из базовой коллекции. Подходит как для деловых совещаний, так и для встреч с друзьями.'}
                        rows={3} showCount/>
                </Form.Item>
                <div className={s.block}>
                    <h3 className={s.subtitle}>Габариты упаковки</h3>
                    <div className={s.dimensions}>
                        <div>
                            <Form.Item name={'length'} label={'Длина, см'} rules={[
                                {
                                    min: 0,
                                    type: 'number',
                                    message: 'Недопустимое значение'
                                }
                            ]}>
                                <InputNumber controls={false} placeholder={'10'}/>
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item name={'width'} label={'Ширина, см'} rules={[
                                {
                                    min: 0,
                                    type: 'number',
                                    message: 'Недопустимое значение'
                                }
                            ]}>
                                <InputNumber controls={false} placeholder={'10'}/>
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item name={'height'} label={'Высота, см'} rules={[
                                {
                                    min: 0,
                                    type: 'number',
                                    message: 'Недопустимое значение'
                                }
                            ]}>
                                <InputNumber controls={false} placeholder={'10'}/>
                            </Form.Item>
                        </div>


                    </div>
                </div>
                <EditProductCharacteristics characteristics={characteristics} product={product}
                                            setCharacteristics={setCharacteristics} refetch={refetch}/>
                <div className={s.block}>
                    <h3 className={s.subtitle}>Базовая стоимость</h3>
                    <div className={s.columns}>
                        <div>
                            <Form.Item name={'basic_price'} label={'Стоимость, ₽'}>
                                <InputNumber className={s.price} placeholder={'2500'} controls={false}/>
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item name={'sale_type'} label={'Скидка'}>
                                <Select onChange={setSale} className={s.select} suffixIcon={<CaretDownFilled/>}
                                        allowClear placeholder={'нет'}>
                                    <Option value={0}>Фиксированная</Option>
                                    <Option value={1}>В процентах</Option>
                                </Select>
                            </Form.Item>
                        </div>
                        <div>
                            {sale !== undefined ? <Form.Item name={'sale'} label={`Величина скидки, ${sale === 0 ? '₽' : '%'}`}>
                                <InputNumber className={s.price} controls={false} placeholder={'50'} max={sale === 1 ? 99 : undefined}/>
                            </Form.Item>: null}
                        </div>
                    </div>
                </div>
                <EditProductSizes sizes={sizes} product={product} setSizes={setSizes} refetch={refetch}/>
                <div className={s.block}>
                    <h3 className={s.subtitle}>SEO</h3>
                    <div className={s.columns}>
                        <div>
                            <Form.Item name={'seo_title'} label={'Заголовок страницы'}>
                                <Input.TextArea placeholder={'Рубашка для офиса'} rows={3} showCount maxLength={255}/>
                            </Form.Item>

                        </div>
                        <div>
                            <Form.Item name={'meta_desc'} label={'Описание'}>
                                <Input.TextArea placeholder={'Рубашка для офиса'} rows={3} showCount/>
                            </Form.Item>
                        </div>
                    </div>
                </div>
                <div className={s.block}>
                    <h3 className={s.subtitle}>Ссылки на маркетплейсы</h3>
                    <div className={s.columns}>
                        <div>
                            <Form.Item name={'wildberries'} label={'Артикул на Wildberries'}>
                                <Input placeholder={'152094709'}/>
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item name={'detmir'} label={'Ссылка на Детский Мир'}>
                                <Input placeholder={'https://www.detmir.ru/product/index/id/6363559'}/>
                            </Form.Item>
                        </div>
                    </div>
                </div>

                <Form.Item>
                    <div className={s.btns}>
                        <Button type={'primary'} htmlType={'submit'}>Сохранить</Button>
                        <Popconfirm
                            title={'Удаление товара'}
                            description={'Вместе с товаром будут удалены его характеристики и размеры. Продолжить?'}
                            onConfirm={() => {
                                if (product?.id) {
                                    deleteProduct(product.id).then((r) => {
                                        //push('/admin/products')
                                        message.success('Товар удален')
                                        window.close()
                                    })
                                }
                            }}
                            okText="Да"
                            cancelText="Отмена"
                            icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                        >
                            <Button>Удалить</Button>
                        </Popconfirm>
                        <Button onClick={createCopy}>Создать копию товара</Button>
                    </div>
                </Form.Item>
            </Form>
        </>
    )
}
