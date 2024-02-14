"use client";
import {
    App,
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Row,
    Select,
    Switch
} from "antd";
import {useMutation, useQuery} from "react-query";
import {
    GetProductFetcher, ProductCopyFetcher,
    ProductDeleteFetcher,
    ProductUpdateFetcher,
    ProductUpdateGalleryFetcher
} from "@/fsd/shared/api/products";
import {notFound, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import s from './EditProduct.module.scss';
import {CaretDownFilled, QuestionCircleOutlined} from "@ant-design/icons";
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

export default function EditProduct({id}: { id: string }) {
    const {push} = useRouter();
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const {
        data: dataPromos,
    } = useQuery(['promos_all'], PromosFetcher);
    const [sale, setSale] = useState<string | undefined>();
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
                        window.close()
                        //push('/admin/products')
                    })
                }}
            >
                <Row gutter={30}>
                    {isSuccessSections && <Col span={12}>
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
                                    sections.filter(el => el.link).map(el => (
                                        <Option key={el.id} value={el.id}>{el.name}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>}
                    {categories && <Col span={12}>
                        <Form.Item name={'category_id'} label={'Категория'} rules={[
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
                    </Col>}
                </Row>
                <Row gutter={30}>
                    <Col span={8}>
                        <Form.Item name={'visible'} label={'Отображать в каталоге'} valuePropName={'checked'}>
                            <Switch/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name={'is_popular'} label={'Отображать в популярном'} valuePropName={'checked'}>
                            <Switch/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name={'is_new'} label={'Отображать как новинку'} valuePropName={'checked'}>
                            <Switch/>
                        </Form.Item>
                    </Col>
                </Row>
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
                <Form.Item name={'description'} label={'Описание товара'}>
                    <Input.TextArea
                        placeholder={'Рубашка из базовой коллекции. Подходит как для деловых совещаний, так и для встреч с друзьями.'}
                        rows={3} showCount/>
                </Form.Item>
                <div className={s.block}>
                    <h3 className={s.subtitle}>Габариты упаковки</h3>
                    <Row gutter={30}>
                        <Col span={4}>
                            <Form.Item name={'length'} label={'Длина, см'} rules={[
                                {
                                    min: 0,
                                    type: 'number',
                                    message: 'Недопустимое значение'
                                }
                            ]}>
                                <InputNumber controls={false} placeholder={'10'}/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name={'width'} label={'Ширина, см'} rules={[
                                {
                                    min: 0,
                                    type: 'number',
                                    message: 'Недопустимое значение'
                                }
                            ]}>
                                <InputNumber controls={false} placeholder={'10'}/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name={'height'} label={'Высота, см'} rules={[
                                {
                                    min: 0,
                                    type: 'number',
                                    message: 'Недопустимое значение'
                                }
                            ]}>
                                <InputNumber controls={false} placeholder={'10'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
                <EditProductCharacteristics characteristics={characteristics} product={product}
                                            setCharacteristics={setCharacteristics} refetch={refetch}/>
                <div className={s.block}>
                    <h3 className={s.subtitle}>Стоимость</h3>
                    <Row gutter={30}>
                        <Col span={8}>
                            <Form.Item name={'basic_price'} label={'Стоимость, ₽'}>
                                <InputNumber className={s.price} placeholder={'2500'} controls={false}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name={'sale_type'} label={'Скидка'}>
                                <Select onChange={setSale} className={s.select} suffixIcon={<CaretDownFilled/>}
                                        allowClear placeholder={'нет'}>
                                    <Option value={'fixed'}>Фиксированная</Option>
                                    <Option value={'percents'}>В процентах</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        {sale ? <Col span={8}>
                            <Form.Item name={'sale'} label={`Величина скидки, ${sale === 'fixed' ? '₽' : '%'}`}>
                                <InputNumber className={s.price} controls={false}/>
                            </Form.Item>
                        </Col> : null}
                    </Row>
                </div>
                <EditProductSizes sizes={sizes} product={product} setSizes={setSizes} refetch={refetch}/>
                <div className={s.block}>
                    <h3 className={s.subtitle}>SEO</h3>
                    <Row gutter={30}>
                        <Col span={12}>
                            <Form.Item name={'meta_desc'} label={'Описание'}>
                                <Input.TextArea placeholder={'Рубашка для офиса'} rows={3} showCount/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={'meta_keywords'} label={'Ключевые слова'}>
                                <Input.TextArea placeholder={'рубашка, костюм, белая рубашка'} rows={3}
                                                showCount/>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
                <div className={s.block}>
                    <h3 className={s.subtitle}>Ссылки на маркетплейсы</h3>
                    <Row gutter={30}>
                        <Col span={12}>
                            <Form.Item name={'wildberries'} label={'Артикул на Wildberries'}>
                                <Input placeholder={'152094709'}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={'detmir'} label={'Ссылка на Детский Мир'}>
                                <Input placeholder={'https://www.detmir.ru/product/index/id/6363559'}/>
                            </Form.Item>
                        </Col>
                    </Row>
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
