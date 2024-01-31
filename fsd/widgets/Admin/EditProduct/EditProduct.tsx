"use client";
import {
    App,
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Radio,
    Row,
    Select,
    Space,
    Switch,
    Tooltip
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
import {UploadFile} from "antd/es/upload/interface";
import UploadImage from "@/fsd/shared/ui/UploadImage/UploadImage";
import s from './EditProduct.module.scss';
import {CaretDownFilled, QuestionCircleOutlined} from "@ant-design/icons";
import {SectionsAllFetcher} from "@/fsd/shared/api/section";
import {CategoriesFetcher} from "@/fsd/shared/api/category";
import {ICharacteristic, ICharacteristicType} from "@/fsd/entities/characteristics/model";
import {
    CharacteristicCreateOrUpdateFetcher,
    CharacteristicsByCategoryFetcher, CharacteristicsProductUpdateFetcher,
    CharacteristicsTypeCreateOrUpdateFetcher
} from "@/fsd/shared/api/characteristics";
import AddIcon from "@/fsd/shared/ui/icons/AddIcon/AddIcon";
import {SizesByCategoryFetcher, SizesCreateOrUpdateFetcher, SizesProductUpdateFetcher} from "@/fsd/shared/api/size";
import {ISize} from "@/fsd/entities/size/model";
import {clsx} from "clsx";
import {ICategory} from "@/fsd/entities/category/model";
import {PromosFetcher} from "@/fsd/shared/api/promo";

export default function EditProduct({id}: { id: string }) {
    const {push} = useRouter();
    const [form] = Form.useForm();
    const [characteristicTypeForm] = Form.useForm();
    const [characteristicForm] = Form.useForm();
    const [sizeForm] = Form.useForm();
    const [productSizeForm] = Form.useForm();
    const {message} = App.useApp();
    const {
        data: dataPromos,
    } = useQuery(['promos_all'], PromosFetcher);
    const [openModalCharacteristicType, setOpenModalCharacteristicType] = useState(false)
    const [openModalCharacteristic, setOpenModalCharacteristic] = useState(false)
    const [openModalSize, setOpenModalSize] = useState(false)
    const [openModalProductSize, setOpenModalProductSize] = useState(false)
    const [image, setImage] = useState<UploadFile[]>([])
    const [sale, setSale] = useState<string | undefined>();
    const [sizes, setSizes] = useState<ISize[]>([]);
    const [characteristics, setCharacteristics] = useState<ICharacteristicType[] | undefined>();
    const [categories, setCategories] = useState<ICategory[] | undefined>();
    const {data: product, isSuccess, isError, refetch} = useQuery(['product', id], () => GetProductFetcher(id))
    useEffect(() => {
        if (isSuccess) {
            form.setFieldsValue(product)
            for(let characteristic of product?.characteristics){
                form.setFieldValue(['characteristic', characteristic.type], characteristic.id)
            }
            form.setFieldValue('section_id', product?.category?.section.id)
            form.setFieldValue('promos', (product?.promos ? product?.promos : []))
            getCategories(product?.category?.section.id ?? '').then(setCategories)
            setSale(product?.sale_type)
            setImage(product.gallery ? product.gallery.map(el => ({
                uid: /https/.test(el) ? el : el.split('.')[0],
                name: el,
                status: 'done',
                url: /https/.test(el) ? el : `${process.env.APP_BASE_URL}/files/${el}`,
                response: el
            })) : [])
            getCharacteristicsTypes(product?.category_id).then(setCharacteristics)
            getSizes(product?.category_id).then(setSizes)
            //getCategories(product?.section_id).then(setCategories)
        }
    }, [isSuccess]);
    const {
        data: sections,
        isSuccess: isSuccessSections
    } = useQuery(['sections_all'], SectionsAllFetcher);
    const {mutateAsync: updateGallery} = useMutation(ProductUpdateGalleryFetcher)
    const {mutateAsync: updateProduct} = useMutation(ProductUpdateFetcher)
    const {mutateAsync: getCategories} = useMutation(CategoriesFetcher);
    const {mutateAsync: getCharacteristicsTypes} = useMutation(CharacteristicsByCategoryFetcher);
    const {mutateAsync: createCharacteristicType} = useMutation(CharacteristicsTypeCreateOrUpdateFetcher);
    const {mutateAsync: createCharacteristic} = useMutation(CharacteristicCreateOrUpdateFetcher);
    const {mutateAsync: updateProductCharacteristic} = useMutation(CharacteristicsProductUpdateFetcher);
    const {mutateAsync: getSizes} = useMutation(SizesByCategoryFetcher);
    const {mutateAsync: createSize} = useMutation(SizesCreateOrUpdateFetcher);
    const {mutateAsync: createProductSize} = useMutation(SizesProductUpdateFetcher);
    const {mutateAsync: deleteProduct} = useMutation(ProductDeleteFetcher);
    const {mutateAsync: copyProduct} = useMutation(ProductCopyFetcher);
    const changeImage = (fileName: string, fileList: UploadFile[]) => {
        const data = {
            id,
            gallery: fileList.map(f => f.response)
        }
        updateGallery(data).then(res => {
            message.success('Галерея обновлена').then()
            refetch();
        })
    }
    const {Option} = Select;
    if (isError) return notFound();
    async function createCopy(){
        if(product?.id){
            copyProduct(product.id).then((r)=>{
                push(`/admin/product/${r.id}`)
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
                    }).then(()=>{
                        window.close()
                        //push('/admin/products')
                    })
                }}
            >
                <Row gutter={30}>
                    {isSuccessSections && <Col span={12}>
                        <Form.Item className={s.select} label={'Раздел'} name={'section_id'}>
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
                        <Form.Item name={'category_id'} label={'Категория'}>
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
                <Form.Item label={'Галерея'}>
                    <UploadImage list={image} changeImage={changeImage} setFileList={setImage} maxLength={10} multiple={true}/>
                </Form.Item>
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
                <Form.Item name={'title'} label={'Название товара'}>
                    <Input placeholder={'Рубашка белая'} maxLength={60} showCount/>
                </Form.Item>
                <Form.Item name={'description'} label={'Описание товара'}>
                    <Input.TextArea
                        placeholder={'Рубашка из базовой коллекции. Подходит как для деловых совещаний, так и для встреч с друзьями.'}
                        rows={3}  showCount/>
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
                <div className={s.block}>
                    <div className={s.blockHeader}>
                        <h3 className={s.subtitle}>Характеристики</h3>
                        <AddIcon onClick={()=>{
                            setOpenModalCharacteristicType(true)
                            characteristicTypeForm.setFieldValue('category', product?.category_id)
                        }}/>
                        <Tooltip
                            overlayInnerStyle={{width: '30rem'}}
                            title="Характеристика — параметр товара, который нельзя выбрать при покупке, он не влияет на его цену и отображается в подробной карточке товара. Например, состав ткани или тип застежки. Характеристика привязана к категории и позволяет фильтровать товары. Включить или выключить фильтрацию по конкретной характеристике можно во вкладке категории.">
                            <QuestionCircleOutlined/>
                        </Tooltip>
                    </div>
                    <Row gutter={30}>
                        {(characteristics && !!characteristics.length) && characteristics.map(el => (
                            <Col key={el.id} span={8}>
                                <Form.Item label={el.name} name={['characteristic', el.id]}>
                                    <Select className={s.select} suffixIcon={<CaretDownFilled/>} allowClear placeholder={'Не выбрано'} onChange={(e)=>{
                                        if(product?.id){
                                            updateProductCharacteristic({productId: product?.id, characteristic: product?.characteristics.find(ch => ch.type === el.id)?.id ?? '', newValue: e}).then((r)=>{
                                                refetch();
                                            })
                                        }
                                    }}>
                                        {el.characteristics?.map(c => (
                                            <Option value={c.id} key={c.id}>{c.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <p className={s.addValue} onClick={()=>{
                                    setOpenModalCharacteristic(true)
                                    characteristicForm.setFieldValue('type', el.id)
                                }}>Добавить значение</p>
                            </Col>
                        ))}
                    </Row>
                </div>
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
                                <Select onChange={setSale} className={s.select} suffixIcon={<CaretDownFilled/>} allowClear placeholder={'нет'}>
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
                <div className={s.block}>
                    <div className={s.blockHeader}>
                        <h3 className={s.subtitle}>Размеры</h3>
                        <AddIcon onClick={()=>{
                            setOpenModalSize(true)
                            sizeForm.setFieldValue('category', product?.category_id)
                        }}/>
                    </div>
                    <div className={s.sizes}>
                        {sizes.map(size => (
                            <div
                                className={clsx(s.size, !product?.sizes.find(e => e.id === size.id)?.ProductSize?.quantity && s.emptySize)}
                                key={size.id}
                                onClick={()=>{
                                    const quantity = product?.sizes.find(e => e.id === size.id)?.ProductSize?.quantity
                                    const barcodeId = product?.sizes.find(e => e.id === size.id)?.ProductSize?.barcodeId
                                    productSizeForm.resetFields();
                                    productSizeForm.setFieldValue('productId', product?.id);
                                    productSizeForm.setFieldValue('sizeId', size.id);
                                    productSizeForm.setFieldValue('quantity', quantity)
                                    productSizeForm.setFieldValue('barcodeId', barcodeId)
                                    setOpenModalProductSize(true)
                                }}
                            >{size.name}</div>
                        ))}
                    </div>
                </div>
                <div className={s.block}>
                    <h3 className={s.subtitle}>SEO</h3>
                    <Row gutter={30}>
                        <Col span={12}>
                            <Form.Item name={'meta_desc'} label={'Описание'}>
                                <Input.TextArea placeholder={'Рубашка для офиса'} rows={3} maxLength={255} showCount/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={'meta_keywords'} label={'Ключевые слова'}>
                                <Input.TextArea placeholder={'рубашка, костюм, белая рубашка'} rows={3} maxLength={255}
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
                            description={'Вместе с товаром будут удалены его характеристики и фото. Продолжить?'}
                            onConfirm={()=>{
                                if(product?.id){
                                    deleteProduct(product.id).then((r)=>{
                                        //push('/admin/products')
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
            <Modal
                open={openModalCharacteristicType}
                onCancel={()=>setOpenModalCharacteristicType(false)}
                title={'Добавить характеристику'}
                footer={null}
            >
                <Form
                    layout={'vertical'}
                    form={characteristicTypeForm}
                    onFinish={(e)=>{
                        createCharacteristicType(e).then(r => {
                            if(product?.category_id){
                                getCharacteristicsTypes(product?.category_id).then(setCharacteristics)
                                setOpenModalCharacteristicType(false)
                            }
                        })
                    }}
                >
                    <Form.Item name={'category'} hidden={true}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'name'} label={'Отображаемое название'} >
                        <Input placeholder={'Материал'}/>
                    </Form.Item>
                    <Form.Item name={'is_filtered'} label={'Использовать характеристику в фильтрах'} valuePropName={'checked'}>
                        <Switch/>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'} type={'primary'}>Добавить</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={openModalCharacteristic}
                onCancel={()=>setOpenModalCharacteristic(false)}
                title={'Добавить значение'}
                footer={null}
            >
                <Form
                    layout={'vertical'}
                    form={characteristicForm}
                    onFinish={(e)=>{
                        createCharacteristic(e).then(r => {
                            if(product?.category_id){
                                getCharacteristicsTypes(product?.category_id).then(setCharacteristics)
                                setOpenModalCharacteristic(false)
                            }
                        })
                    }}
                >
                    <Form.Item name={'type'} hidden={true}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'name'} label={'Отображаемое название'}>
                        <Input placeholder={'хлопок'}/>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'} type={'primary'}>Добавить</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={openModalSize}
                onCancel={()=>setOpenModalSize(false)}
                title={'Добавить размер'}
                footer={null}
            >
                <Form
                    layout={'vertical'}
                    form={sizeForm}
                    onFinish={(e)=>{
                        createSize(e).then(r => {
                            if(product?.category_id){
                                getSizes(product?.category_id).then(setSizes)
                                setOpenModalSize(false)
                            }
                        })
                    }}
                >
                    <Form.Item name={'category'} hidden={true}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'name'} label={'Отображаемое название'} >
                        <Input placeholder={'M'}/>
                    </Form.Item>
                    <Form.Item name={'value'} label={'Значение в размерной сетке'} >
                        <Input placeholder={'Обхват груди: 90см'}/>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'} type={'primary'}>Добавить</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={openModalProductSize}
                onCancel={()=>setOpenModalProductSize(false)}
                title={'Информация о размере'}
                footer={null}
            >
                <Form
                    layout={'vertical'}
                    form={productSizeForm}
                    onFinish={(e)=>{
                        createProductSize(e).then(r => {
                            refetch()
                            setOpenModalProductSize(false)
                        })
                    }}
                >
                    <Form.Item name={'productId'} hidden={true}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'sizeId'} hidden={true}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'barcodeId'} label={'Id в 1С'}>
                        <Input placeholder={'eecef378-4703-11ee-94ed-bad53580fd51'}/>
                    </Form.Item>
                    <Form.Item className={s.formItem} name={'quantity'} label={'В наличии, шт'} required={false} rules={[
                        {
                            required: true,
                            message: 'Это обязательное значение'
                        },
                        {
                            min: 0,
                            type: 'number',
                            message: 'Количество не может быть отрицательным'
                        }
                    ]}>
                        <InputNumber placeholder={'10'} controls={false}/>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'} type={'primary'}>Сохранить</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
