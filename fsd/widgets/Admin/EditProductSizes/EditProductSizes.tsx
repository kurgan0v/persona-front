import s from "./EditProductSizes.module.scss";
import AddIcon from "@/fsd/shared/ui/icons/AddIcon/AddIcon";
import {clsx} from "clsx";
import {App, Button, Form, Input, InputNumber, Modal} from "antd";
import {useMutation} from "react-query";
import {SizesByCategoryFetcher, SizesCreateOrUpdateFetcher, SizesProductUpdateFetcher} from "@/fsd/shared/api/size";
import React, {useState} from "react";
import {ISize} from "@/fsd/entities/size/model";
import {IProductDetail} from "@/fsd/entities/product/model";

interface EditProductSizesProps {
    sizes: ISize[]
    product?: IProductDetail
    setSizes: React.Dispatch<React.SetStateAction<ISize[]>>
    refetch: any
}

export default function EditProductSizes({sizes, product, setSizes, refetch}: EditProductSizesProps) {
    const {message} = App.useApp();
    const [openModalSize, setOpenModalSize] = useState(false)
    const [openModalProductSize, setOpenModalProductSize] = useState(false)
    const [sizeForm] = Form.useForm();
    const [productSizeForm] = Form.useForm();
    const {mutateAsync: createSize} = useMutation(SizesCreateOrUpdateFetcher);
    const {mutateAsync: getSizes} = useMutation(SizesByCategoryFetcher);
    const {mutateAsync: createProductSize} = useMutation(SizesProductUpdateFetcher);
    return (
        <>
            <div className={s.block}>
                <div className={s.blockHeader}>
                    <h3 className={s.subtitle}>Размеры</h3>
                    <AddIcon onClick={() => {
                        setOpenModalSize(true)
                        sizeForm.setFieldValue('category', product?.category_id)
                    }}/>
                </div>
                <div className={s.sizes}>
                    {sizes.length ? sizes.map(size => (
                        <div
                            className={clsx(s.size, !product?.sizes.find(e => e.id === size.id)?.ProductSize?.quantity && s.emptySize, product?.sizes.find(e => e.id === size.id)?.ProductSize?.barcodeId && s.withBarcode)}
                            key={size.id}
                            onClick={() => {
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
                    )) : <p>В категории пока нет размеров</p>}
                </div>
            </div>
            <Modal
                open={openModalSize}
                onCancel={() => setOpenModalSize(false)}
                title={'Добавить размер'}
                footer={null}
            >
                <Form
                    layout={'vertical'}
                    form={sizeForm}
                    onFinish={(e) => {
                        createSize(e).then(r => {
                            if (product?.category_id) {
                                getSizes(product?.category_id).then(setSizes)
                                message.success('Размер добавлен')
                                setOpenModalSize(false)
                                sizeForm.resetFields()
                            }
                        })
                    }}
                >
                    <Form.Item name={'category'} hidden={true}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'name'} label={'Отображаемое название'} rules={[
                        {
                            required: true,
                            message: 'Это обязательное поле'
                        }
                    ]}>
                        <Input placeholder={'M'}/>
                    </Form.Item>
                    <Form.Item name={'value'} label={'Значение в размерной сетке'}>
                        <Input placeholder={'Обхват груди: 90см'}/>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'} type={'primary'}>Добавить</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={openModalProductSize}
                onCancel={() => setOpenModalProductSize(false)}
                title={'Информация о размере'}
                footer={null}
            >
                <Form
                    layout={'vertical'}
                    form={productSizeForm}
                    onFinish={(e) => {
                        createProductSize(e).then(r => {
                            refetch()
                            message.success('Наличие товара обновлено')
                            setOpenModalProductSize(false)
                            productSizeForm.resetFields()
                        })
                    }}
                >
                    <Form.Item name={'productId'} hidden={true}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'sizeId'} hidden={true}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'barcodeId'} label={'Штрихкод в 1С'}>
                        <Input placeholder={'2038140115031'}/>
                    </Form.Item>
                    <Form.Item className={s.formItem} name={'quantity'} label={'В наличии, шт'} required={false}
                               rules={[

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
